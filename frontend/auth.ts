import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchGoogleCheck(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  const urls = [
    `${API_BASE_URL}/auth/google-check`,
    "http://127.0.0.1:5000/api/auth/google-check",
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // try fallback URL
    }
  }
  return null;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  debug: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      checks: ["state"],
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: (credentials.email as string).trim(),
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.success || !data.data) {
            return null;
          }

          const { token, user } = data.data;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            mobileNumber: user.mobileNumber,
            token,
          };
        } catch (error) {
          console.error("Auth authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return "/register?error=AccountNotFound";

        const data = await fetchGoogleCheck(user.email);

        if (!data || !data.success || !data.data?.exists) {
          // Redirect directly to /register with pre-filled email
          return `/register?error=AccountNotFound&email=${encodeURIComponent(
            user.email,
          )}`;
        }

        return true;
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.provider === "google" && user.email) {
          const data = await fetchGoogleCheck(user.email);

          if (data && data.success && data.data?.exists) {
            const dbUser = data.data.user;
            token.id = dbUser.id;
            token.name = dbUser.name;
            token.role = dbUser.role;
            token.mobileNumber = dbUser.mobileNumber;
            token.accessToken = data.data.token;
          }
        } else {
          token.id = user.id;
          token.role = user.role;
          token.mobileNumber = user.mobileNumber;
          token.accessToken = user.token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.mobileNumber = token.mobileNumber as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || "your-long-random-secret",
});
