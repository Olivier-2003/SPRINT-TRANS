import type { NextAuthConfig } from "next-auth";

/**
 * Konfiguracja bezpieczna dla Edge Runtime (middleware) — bez dostępu do bazy danych
 * (Prisma/`pg`) ani bcrypt. Pełna konfiguracja z providerem Credentials jest w lib/auth.ts
 * i używana wyłącznie w Server Actions / route handlerach (Node.js runtime).
 */
export const authConfig = {
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = request.nextUrl.pathname === "/admin/login";

      if (!request.nextUrl.pathname.startsWith("/admin")) return true;
      if (isLoginPage) {
        return isLoggedIn
          ? Response.redirect(new URL("/admin", request.nextUrl.origin))
          : true;
      }
      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
