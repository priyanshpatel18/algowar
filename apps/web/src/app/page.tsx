"use client"

import { useRouter } from 'next/navigation';
import { useRef } from 'react';

const BACKEND_URL = 'http://localhost:3000';

export default function Home() {
  const router = useRouter();
  const guestName = useRef<HTMLInputElement>(null);

  async function loginAsGuest() {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: guestName.current?.value || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const user = await response.json();
      if (user) {
        router.push('/game');
      }
    } catch (error) {
      console.error('Failed to login as guest:', error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Enter your name</h1>
        <input
          type="text"
          ref={guestName}
          placeholder="Username"
          className="border px-4 py-2 rounded-md mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={loginAsGuest}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md w-full transition duration-300 ease-in-out"
        >
          Login
        </button>
      </div>
    </div>
  )
}
