"use client"

import githubImage from '@/assets/github.png';
import googleImage from '@/assets/google.png';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { store } from '@/store/store';
import { AUTH_PROVIDER } from '@repo/database';
import { signIn } from "next-auth/react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Login() {
  const router = useRouter();
  const guestName = useRef<HTMLInputElement>(null);
  const { loading, setLoading } = store();
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [githubLoading, setGithubLoading] = useState<boolean>(false);
  const [guestLoading, setGuestLoading] = useState<boolean>(false);

  async function handleAuth(provider: AUTH_PROVIDER) {
    setLoading(true);

    try {
      if (provider === "GITHUB") {
        await signIn("github");
      } else if (provider === "GOOGLE") {
        await signIn("google");
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
      setGithubLoading(false);
      setGuestLoading(false);
      setGoogleLoading(false);
    }
  }

  async function loginAsGuest(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setGuestLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/guest`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: guestName.current?.value }),
      });

      const { user } = await response.json();

      if (response.ok && user) {
        router.push('/game');
        // const result = await signIn("credentials", {
        //   email: user.email,
        //   name: user.name,
        //   redirect: false
        // });
        // if (result?.status === 200) {
        // }
      }

    } catch (error) {
      console.error('Failed to login as guest:', error);
    } finally {
      setGuestLoading(false);
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)] px-4 md:px-0">
      <main className="flex flex-col items-center w-full max-w-md">
        <h1 className="font-bold text-xl lg:text-3xl mb-4">Sign in to your account</h1>
        <div className='flex flex-col gap-6 w-full'>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              variant="outline"
              className='w-full'
              onClick={() => handleAuth("GOOGLE")}
              disabled={loading}
            >
              {
                googleLoading ?
                  <div className="loader-dark" />
                  :
                  <div className='flex items-center gap-4'>
                    <Image src={googleImage} alt="Google Login" width={25} height={25} className="cursor-pointer" />
                    <span>Google</span>
                  </div>
              }
            </Button>
            <Button
              variant="outline"
              className='w-full'
              onClick={() => handleAuth("GITHUB")}
              disabled={loading}
            >
              {githubLoading ?
                <div className="loader-dark" />
                :
                <div className='flex items-center gap-4'>
                  <Image src={githubImage} alt="Github Login" width={25} height={25} className="cursor-pointer" />
                  <span>Github</span>
                </div>
              }
            </Button>
          </div>
          <div className='relative'>
            <Separator />
            <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 uppercase text-muted-foreground text-xs lg:text-sm bg-background'>or continue with</span>
          </div>
          <form className='flex flex-col gap-6' onSubmit={loginAsGuest}>
            <label htmlFor='name'>
              <input
                id='name'
                className='w-full py-2 px-4 bg-background border-[1px] border-border rounded-md outline-none'
                placeholder='Enter name'
                ref={guestName}
                required
              />
            </label>
            <Button
              type='submit'
              disabled={loading}
            >
              {guestLoading ? <div className="loader-light" /> : "Continue as Guest"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}