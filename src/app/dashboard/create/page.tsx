"use client";

import "@/app/styles/create-character.css";
import AutocompleteInput from "@/app/ui/autocompleteInput";
import { addChar } from "@/app/libs/add-char";
import { useState } from "react";

export default function CreateCharacter() {
  // (opcional) guardar o nome escolhido para um preview simples
  const [nomeSelecionado, setNomeSelecionado] = useState("");

  return (
    <section className="create-character-display">
      <div>
        <h2>Avaliar um novo personagem (Naruto)</h2>
      </div>

      <form action={addChar} className="create-character-formulario">
        {/* URL da imagem (opcional) */}
        <section className="characterInputDados">
          <input
            type="text"
            id="img"
            name="img"
            placeholder="URL da imagem (opcional)"
            aria-label="URL da imagem"
          />
        </section>

        {/* Autocomplete: deve renderizar um input name="nome" internamente */}
        <section className="characterInputDados">
          <AutocompleteInput onSelect={setNomeSelecionado} />
        </section>

        {/* Nota 0–10 */}
        <section className="characterInputDados">
          <input
            type="number"
            id="nota"
            name="nota"
            placeholder="Nota de 0 a 10"
            aria-label="Nota de 0 a 10"
            min={0}
            max={10}
            required
          />
        </section>

        {/* Descrição */}
        <section className="characterInputDados">
          <input
            type="text"
            id="descricao"
            name="descricao"
            placeholder="Comentários sobre o personagem"
            aria-label="Comentários sobre o personagem"
          />
        </section>

        {/* Aniversário e Clã (opcionais, mas já suportados no addChar) */}
        <section className="characterInputDados">
          <input
            type="text"
            id="aniversario"
            name="aniversario"
            placeholder="Aniversário (ex: 10/10)"
            aria-label="Aniversário do personagem"
          />
        </section>

        <section className="characterInputDados">
          <input
            type="text"
            id="cla"
            name="cla"
            placeholder="Clã (ex: Uzumaki)"
            aria-label="Clã do personagem"
          />
        </section>

        <button>Adicionar</button>
      </form>

      {/* Preview simples do nome selecionado (opcional) */}
      {nomeSelecionado && (
        <div style={{ marginTop: "16px" }}>
          <strong>Selecionado:</strong> {nomeSelecionado}
        </div>
      )}
    </section>
  );
}
