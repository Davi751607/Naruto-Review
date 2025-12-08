"use client";

import Image from "next/image";
import userIcon from "public/user.png";
import passwordIcon from "public/padlock.png";

import "@/app/styles/login.css";
import { z } from "zod";
import toast from "react-hot-toast";
import { createUser } from "@/app/libs/credentials";
import { LoginCredentials } from "../login/page";
import { redirect } from "next/navigation";

const CreateUserSchema = z
  .object({
    nome: z
      .string()
      .trim()
      .min(1, { message: "Nome é obrigatório" }),
    email: z
      .string()
      .trim()
      .email("Email em formato incorreto. Tente novamente."),
    password: z
      .string({ message: "Insira uma senha." })
      .trim()
      .min(4, { message: "Sua senha precisa ter um mínimo de 4 caracteres" }),
    confPassword: z
      .string({ message: "Confirme sua senha." })
      .trim()
      .min(1, { message: "Confirmação de senha não pode estar vazia" }),
  })
  .refine((data) => data.password === data.confPassword, {
    message: "As senhas não conferem",
    path: ["confPassword"],
  });

export default function CreateUser() {
  const createUserClient = async (formData: FormData) => {
    const createUserData = {
      nome: formData.get("nome") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confPassword: formData.get("conf-password") as string,
    };

    const result = CreateUserSchema.safeParse(createUserData);

    if (!result.success) {
      const errorMsg =
        result.error.issues.map((i) => i.message).join(". ") + ".";
      toast.error(errorMsg);
      return;
    }

    const retorno = await createUser(createUserData as LoginCredentials & { nome: string });

    if (retorno.error) {
      toast.error(retorno.error);
      return;
    } else if (retorno.success) {
      toast.success(retorno.success);
      redirect("/login");
    }
  };

  return (
    <form action={createUserClient} className="login-form">
      <div>
        <section className="user-input">
          <Image src={userIcon} alt="Icone de campo de nome" />
          <input
            type="text"
            name="nome"
            id="nome"
            placeholder="Nome"
            aria-label="Nome"
            required
          />
        </section>

        <section className="user-input">
          <Image src={userIcon} alt="Icone de campo de email" />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            aria-label="Email"
            required
          />
        </section>

        <section className="user-input">
          <Image src={passwordIcon} alt="Icone de campo com senha" />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Senha"
            aria-label="Senha"
            required
          />
        </section>

        <section className="user-input">
          <Image src={passwordIcon} alt="Icone de campo com senha" />
          <input
            type="password"
            name="conf-password"
            id="conf-password"
            placeholder="Confirmar Senha"
            aria-label="Confirmar Senha"
            required
          />
        </section>
      </div>
      <button>Cadastrar</button>
    </form>
  );
}
