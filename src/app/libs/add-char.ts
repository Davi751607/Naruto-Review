
"use server";

import ConexaoBD from "@/app/libs/conexao-bd";
import { redirect } from "next/navigation";
import { getNarutoCharacterByName } from "@/app/libs/narutoapi";

const arquivo = "character-db.json";
const DEFAULT_IMG = "/naruto-placeholder.png"; 

export async function addChar(formData: FormData) {
  const nomeRaw = (formData.get("nome") as string) ?? "";
  const nome = nomeRaw.trim();
  if (!nome) {
    redirect("/dashboard"); // sem nome, apenas volta
  }

  const descricao = ((formData.get("descricao") as string) ?? "").trim();

  let nota = Number(formData.get("nota"));
  if (Number.isNaN(nota)) nota = 0;
  nota = Math.max(0, Math.min(10, nota)); 

  const imgManual = ((formData.get("img") as string) ?? "").trim();
  const aniversarioForm = ((formData.get("aniversario") as string) ?? "").trim();
  const claForm = ((formData.get("cla") as string) ?? "").trim();

  // lê BD primeiro pra validar duplicata
  const db = await ConexaoBD.retornaBD<any[]>(arquivo);
  const arr = Array.isArray(db) ? db : [];

  //  trava anti-duplicata por nome 
  const exists = arr.some(
    (p) => String(p?.nome ?? "").trim().toLowerCase() === nome.toLowerCase()
  );
  if (exists) {
    redirect("/dashboard"); // já existe → não insere
  }

  // completa com API se for necessario
  const apiChar = nome ? await getNarutoCharacterByName(nome) : null;

  const novoChar = {
    id: crypto.randomUUID(),
    nome,
    nota,
    descricao,
    img: imgManual || apiChar?.img || DEFAULT_IMG,
    aniversario: aniversarioForm || apiChar?.aniversario || "",
    cla: claForm || apiChar?.cla || "",
  };

  arr.push(novoChar);
  await ConexaoBD.armazenaBD(arquivo, arr);

  redirect("/dashboard");
}
