import "@/app/styles/dashboard.css";
import Link from "next/link";
import ConexaoBD from "@/app/libs/conexao-bd";
import Character from "@/app/ui/characters";

const bd: string = "character-db.json";

export default async function DisplayRank() {
  const dados = await ConexaoBD.retornaBD(bd);

  // Ordena por nota decrescente
  dados.sort((a, b) => b.nota - a.nota);

  const personagensHTML = dados.map((character: any) => (
    <Character {...character} key={character.id} />
  ));

  return (
    <div className="dashboard-container">
      <div id="top-page">
        <div id="intro">
          <p>Suas Avaliaçoes</p>
          
        </div>

        <Link href={"/dashboard/create"} className="add-char">
          Adicionar
        </Link>
      </div>

      <div className="cardContainer">{personagensHTML}</div>
    </div>
  );
}

