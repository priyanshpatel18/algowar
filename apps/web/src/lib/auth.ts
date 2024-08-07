import { AUTH_PROVIDER, db } from "@repo/database";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface session extends Session {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface token extends JWT {
  uid: string;
  jwtToken: string;
}

interface user {
  id: string;
  name: string;
  email: string;
  token: string;
}

const createUserInDB = async (email: string, name: string, provider: AUTH_PROVIDER, image?: string) => {
  try {
    let user = await db.user.findUnique({
      where: {
        email,
        provider,
      }
    });
    if (user) {
      return user
    };

    user = await db.user.create({
      data: {
        email,
        name,
        provider,
        image,
      },
    });
    return user;
  } catch (error) {
    console.error("Error creating user in DB:", error);
    throw new Error("User creation failed");
  }
};

const getUserByEmail = async (email: string, provider: AUTH_PROVIDER) => {
  try {
    return await db.user.findUnique({ where: { email, provider } });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

export const authOptions: AuthOptions = {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        name: { label: "name", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.name) {
            throw new Error("Email and name are required");
          }

          const email = credentials.email;
          let user = await getUserByEmail(email, "GUEST");

          if (user) return user;
          return null;
        } catch (error) {
          console.error("Error in credentials authorize:", error);
        }

        return null;
      },
    }),
  ],
  secret: process.env.SECRET_KEY || "",
  callbacks: {
    jwt: async ({ token, user }): Promise<JWT> => {
      const newToken: token = token as token;

      if (user) {
        newToken.uid = user.id;
        newToken.jwtToken = (user as user).token;
      }
      return newToken;
    },
    session: async ({ session, token }) => {
      const newSession: session = session as session;
      if (newSession.user && token.uid) {
        newSession.user.id = token.uid as string;
        newSession.user.email = session.user?.email ?? '';
      }
      return newSession!;
    },
    signIn: async ({ account, profile }: any) => {
      let provider: AUTH_PROVIDER | undefined;
      let image: string | undefined;

      if (account?.provider === "github") {
        provider = "GITHUB";
        image = profile.avatar_url;
      } else if (account?.provider === "google") {
        provider = "GOOGLE";
        image = profile.picture;
      }

      if (profile.email && provider) {
        let user = await getUserByEmail(profile.email, provider);

        if (!user) {
          user = await createUserInDB(profile.email, profile.name, provider, image)
        }
      }

      return true;
    }
  },
  pages: {
    signIn: "/sign-in"
  }
} 