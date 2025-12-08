
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "session";


const SECRET = process.env.TOKEN ?? "";
const key = new TextEncoder().encode(SECRET);

if (!SECRET) {
  
  console.warn("[session] TOKEN ausente no .env.local");
}

export type SessionPayload = { userId: string; userEmail: string };

// cria o token e grava o cookie
export async function createSessionToken(userId: string, userEmail: string) {
  if (!SECRET) throw new Error("TOKEN ausente no .env.local");

  const jwt = await new SignJWT({ userId, userEmail } as SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);

  (await cookies()).set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

// retorna o payload se o cookie for válido; senão false
export async function isSessionValid(): Promise<SessionPayload | false> {
  try {
    const c = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!c) return false;
    const { payload } = await jwtVerify(c, key, { algorithms: ["HS256"] });
    return payload as SessionPayload;
  } catch {
    return false;
  }
}

// só o payload (ou null), caso precise em páginas
export async function getSession(): Promise<SessionPayload | null> {
  const ok = await isSessionValid();
  return ok || null;
}

// apaga o cookie
export async function clearSession() {
  (await cookies()).set(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
}
