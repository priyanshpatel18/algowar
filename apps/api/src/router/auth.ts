import { Request, Response, Router } from "express";
import { sign, verify } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { COOKIE_MAX_AGE } from "../consts";
import { db } from "@repo/database";
const router = Router();

interface UserDetails {
  id: string;
  token?: string;
  name: string;
  isGuest?: boolean;
}

interface userJWT {
  userId: string;
  name: string;
  isGuest?: boolean;
}

const NODE_ENV = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

router.post("/guest", async (req: Request, res: Response) => {
  const body = req.body;

  try {
    const guestUUID = "guest-" + uuidv4();
    const user = await db.user.create({
      data: {
        name: body.name || guestUUID,
        email: guestUUID + "@algowar.com",
        provider: "GUEST",
      },
    });

    const token = sign({ userId: user.id, name: user.name, isGuest: true }, JWT_SECRET);
    const userDetails: UserDetails = {
      id: user.id,
      token,
      name: user.name,
      isGuest: true,
    };
    res.cookie("guest", token, {
      httpOnly: true,
      sameSite: NODE_ENV ? "none" : "strict",
      secure: NODE_ENV,
      maxAge: COOKIE_MAX_AGE
    });
    return res.json({ success: true, user: userDetails });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Internal Server Error' });
  }
});

router.get("/refresh", async (req: Request, res: Response) => {
  // if (req.user) {
  // }

  try {
    if (req.cookies && req.cookies.guest) {
      const decoded = verify(req.cookies.guest, JWT_SECRET) as userJWT;
      const token = sign({ userId: decoded.userId, name: decoded.name, isGuest: true }, JWT_SECRET);

      let User: UserDetails = {
        id: decoded.userId,
        name: decoded.name,
        token: token,
        isGuest: true,
      };

      res.cookie("guest", token, {
        httpOnly: true,
        sameSite: NODE_ENV ? "none" : "strict",
        secure: NODE_ENV,
        maxAge: COOKIE_MAX_AGE
      });

      res.status(200).json({ success: true, user: User });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false });
  }
})

export default router;