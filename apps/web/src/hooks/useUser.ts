import { use, useEffect, useState } from "react";
const BACKEND_URL = 'http://localhost:3000';

export interface User {
  id: string;
  username: string;
  token: string;
  isGuest?: boolean;
}

async function getUser() {
  const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUser();
      // Ensure This runs once
      setUser(userData?.user || null);
      setLoading(false);
    }

    fetchUser();
  }, []);

  return { user, loading };
};