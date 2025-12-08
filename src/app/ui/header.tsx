// src/app/ui/header.tsx
import Image from "next/image";
import "@/app/styles/header.css";
import { cookies } from "next/headers";
import { clearSession } from "@/app/libs/session";
import { redirect } from "next/navigation";

export default async function Header() {
  //  Checa só a existência do cookie, igual ao middleware
  const hasSession = !!(await cookies()).get("session");

  async function logout() {
    "use server";
    await clearSession();
    redirect("/login");
  }

  return (
    <header className="header">
      <h1>Naruto Reviews</h1>

      {hasSession && (
        <form action={logout} className="logout-form">
          <button type="submit" className="btn-logout" aria-label="Sair">
            {/* arquivo está em /public/logout.jpg */}
            <Image src="/logout.jpg" alt="Sair" width={58} height={60} />
            <span className="btn-logout-text">Sair</span>
          </button>
        </form>
      )}
    </header>
  );
}
