
"use server";

import { redirect } from "next/navigation";
import ConexaoBD from "@/app/libs/conexao-bd";

import bcrypt from "bcrypt"; 
import { LoginCredentials } from "@/app/(auth)/login/page";
import { createSessionToken } from "@/app/libs/session";

const userDBFile = "usuarios-db.json";

/**
 * Retorna { success } ou { error } (sem redirecionar).
 */
export async function createUser(data: LoginCredentials & { nome: string }) {
  const nome = (data.nome || "").trim();
  const email = (data.email || "").trim();
  const password = (data.password || "").trim();

  // hash da senha
  const passwordCrypt = await bcrypt.hash(password, 10);

  const novoUser = {
    id: crypto.randomUUID(),
    nome,
    email,
    password: passwordCrypt,
  };

  const users = await ConexaoBD.retornaBD<any[]>(userDBFile);

  // checa duplicado
  for (const user of users) {
    if (user.email === email) {
      
      return { error: "Esse email já foi cadastrado" };
    }
  }

  users.push(novoUser);
  await ConexaoBD.armazenaBD(userDBFile, users);

  return { success: "Usuário Criado com Sucesso" };
}

/**
 * Em caso de sucesso, cria sessão e REDIRECIONA para /dashboard.
 * Em caso de erro, retorna { error } (sem redirecionar).
 */
export async function validateCredentials(data: LoginCredentials) {
  const email = (data.email || "").trim();
  const password = (data.password || "").trim();

  const usuariosDB = await ConexaoBD.retornaBD<any[]>(userDBFile);

  const user = usuariosDB.find((u) => u.email === email);

  if (!user) {
    return { error: "Usuário não encontrado" };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    await createSessionToken(user.id, user.email);
    redirect("/dashboard"); 
  } else {
    return { error: "Usuario ou senhas incorretos" };
  }
}
