import Image from "next/image";
import "@/app/styles/characters.css";
import Link from "next/link";
import deleteIcon from "public/delete-icon.png";
import editIcon from "public/edit-icon.png";
import ConexaoBD from "@/app/libs/conexao-bd";
import { redirect } from "next/navigation";

const bd: string = "character-db.json";

export interface CharactersProps {
  id: string;
  nome: string;
  img: string;
  nota: number;
  descricao: string;
  aniversario: string;
  cla: string;
}

export default function Characters(props: CharactersProps) {
  // converte nota 0–10 para estrelas 0–5
  const renderStars = (nota: number) => {
    const normalized = Math.round((nota / 10) * 5);
    const full = normalized;
    const empty = 5 - full;

    return (
      <>
        {Array(full)
          .fill(0)
          .map((_, i) => (
            <span key={i}>⭐</span>
          ))}
        {Array(empty)
          .fill(0)
          .map((_, i) => (
            <span key={`e${i}`}>☆</span>
          ))}
      </>
    );
  };

  // server action para excluir 
  const removerPersonagem = async () => {
    "use server";
    const db = await ConexaoBD.retornaBD<any[]>(bd);
    const idx = db.findIndex((p) => p.id === props.id);
    if (idx !== -1) {
      db.splice(idx, 1);
      await ConexaoBD.armazenaBD(bd, db);
    }
    redirect("/dashboard");
  };

  return (
    <div className="characters-card">
      {/* IMAGEM */}
      <Image src={props.img} width={150} height={200} alt={`Foto de ${props.nome}`} />

      <div id="group1">
        <h2>{props.nome}</h2>
      </div>

      <div id="group2">
        <p>
          <strong>Clã:</strong> {props.cla || "Desconhecido"}
        </p>
        <p>
          <strong>Nascimento:</strong> {props.aniversario || "Desconhecido"}
        </p>
      </div>

      <div id="group3">
        <p>
          <strong>Nota:</strong> {renderStars(props.nota)}
        </p>
        <p>
          <strong>Descrição:</strong>
          <br />
          {props.descricao}
        </p>
      </div>

      <div className="character-buttons-container">
        <Link href={`/dashboard/edit/${props.id}`}>
          <Image src={editIcon} alt="Editar" id="btn-edit" />
        </Link>

        <form action={removerPersonagem}>
          <button id="btn-delete">
            <Image src={deleteIcon} alt="Excluir" id="btn-delete" />
          </button>
        </form>
      </div>
    </div>
  );
}
