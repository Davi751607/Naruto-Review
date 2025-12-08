import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que exigem login
const rotasProtegidas = ["/dashboard"];


const rotasAuth = ["/login", "/create"];

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // Se tentar acessar rota protegida sem cookie -> manda para /login
  if (rotasProtegidas.some((r) => pathname.startsWith(r))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Se já estiver logado e tentar ir para /login ou /create -> manda para /dashboard
  if (rotasAuth.some((r) => pathname.startsWith(r))) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/create",
  ],
};
