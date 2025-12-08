
import ConexaoBD from "@/app/libs/conexao-bd";
import "@/app/styles/create-character.css";
import { redirect } from "next/navigation";

const ARQUIVO = "character-db.json";

type PageProps = {
  params: { id: string }; 
};

export default async function EditChar({ params }: PageProps) {
  const { id } = params;

  const db = await ConexaoBD.retornaBD<any[]>(ARQUIVO);
  const idx = db.findIndex((p) => p.id === id);
  const char = idx >= 0 ? db[idx] : null;

  if (!char) {
    redirect("/dashboard");
  }

 
  async function updateChar(formData: FormData) {
    "use server";

    const dbNow = await ConexaoBD.retornaBD<any[]>(ARQUIVO);
    const pos = dbNow.findIndex((p) => p.id === id);
    if (pos === -1) redirect("/dashboard");

    const old = dbNow[pos];

    const nome = (formData.get("nome") as string)?.trim() || old.nome;
    const img =
      ((formData.get("img") as string) ?? "").toString().trim() || old.img;

    let nota = Number(formData.get("nota"));
    if (Number.isNaN(nota)) nota = old.nota;

    const descricao =
      ((formData.get("descricao") as string) ?? "").toString().trim() ??
      old.descricao;

    const aniversario =
      ((formData.get("aniversario") as string) ?? "")
        .toString()
        .trim() || old.aniversario || "";

    const cla =
      ((formData.get("cla") as string) ?? "").toString().trim() ||
      old.cla ||
      "";

    const updated = {
      ...old,
      nome,
      img,
      nota,
      descricao,
      aniversario,
      cla,
    };

    dbNow.splice(pos, 1, updated);
    await ConexaoBD.armazenaBD(ARQUIVO, dbNow);

    redirect("/dashboard");
  }

  return (
    <div className="create-character-display">
      <h2>{char.nome}</h2>

      <form action={updateChar} className="create-character-formulario">
        <section className="characterInputDados">
          <input
            type="text"
            id="img"
            name="img"
            placeholder="URL da imagem"
            defaultValue={char.img}
          />
        </section>

        {/* nome oculto só para manter compat se precisar */}
        <input type="hidden" id="nome" name="nome" defaultValue={char.nome} />

        <section className="characterInputDados">
          <input
            type="number"
            id="nota"
            name="nota"
            placeholder="Nota de 0 a 10"
            min={0}
            max={10}
            defaultValue={char.nota}
          />
        </section>

        <section className="characterInputDados">
          <input
            type="text"
            id="descricao"
            name="descricao"
            placeholder="Comentários sobre o personagem"
            defaultValue={char.descricao || ""}
          />
        </section>

        <section className="characterInputDados">
          <input
            type="text"
            id="aniversario"
            name="aniversario"
            placeholder="Aniversário"
            defaultValue={char.aniversario || ""}
          />
        </section>

        <section className="characterInputDados">
          <input
            type="text"
            id="cla"
            name="cla"
            placeholder="Clã"
            defaultValue={char.cla || ""}
          />
        </section>

        <button>Atualizar</button>
      </form>
    </div>
  );
}
