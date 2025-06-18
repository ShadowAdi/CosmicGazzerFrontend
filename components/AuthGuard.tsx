// components/AuthGuard.tsx
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, token, getUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/(auth)/signin"); // No token = go to login
      return;
    }

    if (!user) {
      getUser(); // try to fetch user if token exists
    }
  }, [token]);

  useEffect(() => {
    if (user && router.canGoBack()) {
      router.replace("/home");
    }
  }, [user]);

  if (!token || !user) return null; // or show loading spinner

  return <>{children}</>;
}
