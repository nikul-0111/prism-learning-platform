"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { signOut as nextAuthSignOut } from "next-auth/react";
import type { AuthUser, LoginRequest, RegisterRequest } from "@/types/auth.types";
import { login, register } from "@/lib/api/auth.api";
import { get } from "@/lib/api/client";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  loginUser: (data: LoginRequest) => Promise<AuthUser>;
  registerUser: (data: RegisterRequest) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const storedToken = localStorage.getItem("prism_token");
        const storedUser = localStorage.getItem("prism_user");

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }

          // Fetch fresh user data from /api/auth/me
          try {
            const meRes = await get<{ success: boolean; data: AuthUser }>("/auth/me");
            if (meRes?.data) {
              setUser(meRes.data);
              localStorage.setItem("prism_user", JSON.stringify(meRes.data));
            }
          } catch {
            // Token expired or invalid
            localStorage.removeItem("prism_token");
            localStorage.removeItem("prism_user");
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Failed to load auth session:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  async function handleLogin(data: LoginRequest): Promise<AuthUser> {
    const res = await login(data);
    const authToken = res.data?.token || res.token;
    const authUser = res.data?.user || res.user;

    if (!authToken || !authUser) {
      throw new Error("Invalid response from server");
    }

    setToken(authToken);
    setUser(authUser);
    localStorage.setItem("prism_token", authToken);
    localStorage.setItem("prism_user", JSON.stringify(authUser));

    return authUser;
  }

  async function handleRegister(data: RegisterRequest): Promise<AuthUser> {
    const res = await register(data);
    const authToken = res.data?.token || res.token;
    const authUser = res.data?.user || res.user;

    if (!authToken || !authUser) {
      throw new Error("Invalid response from server");
    }

    setToken(authToken);
    setUser(authUser);
    localStorage.setItem("prism_token", authToken);
    localStorage.setItem("prism_user", JSON.stringify(authUser));

    return authUser;
  }

  function handleLogout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("prism_token");
    localStorage.removeItem("prism_user");
    try {
      nextAuthSignOut({ redirect: false });
    } catch {
      // ignore
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginUser: handleLogin,
        registerUser: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
