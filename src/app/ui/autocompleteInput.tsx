"use client";

import { useState, useMemo } from "react";
import { NARUTO_NAMES, norm } from "@/app/libs/naruto-names";
import "@/app/styles/create-character.css";

type Props = { onSelect: (nome: string) => void };

export default function AutocompleteInput({ onSelect }: Props) {
  const [termo, setTermo] = useState("");
  const [aberto, setAberto] = useState(false);

  const sugestoes = useMemo(() => {
    const q = norm(termo);
    if (!q) return [];
    const starts = NARUTO_NAMES.filter((n) => norm(n).startsWith(q));
    const contains = NARUTO_NAMES.filter(
      (n) => !starts.includes(n) && norm(n).includes(q)
    );
    return [...starts, ...contains].slice(0, 8);
  }, [termo]);

  function escolher(nome: string) {
    setTermo(nome);
    setAberto(false);
    onSelect(nome);
  }

  return (
    <div className="autocomplete-wrapper">
      <input
        type="text"
        value={termo}
        placeholder="Nome do Personagem (Naruto)"
        name="nome"
        required
        autoComplete="off"
        onChange={(e) => {
          setTermo(e.target.value);
          setAberto(true);
        }}
        onFocus={() => termo && setAberto(true)}
        onBlur={() => setTimeout(() => setAberto(false), 120)}
      />

      {aberto && sugestoes.length > 0 && (
        <ul className="autocomplete-sugestoes">
          {sugestoes.map((s, i) => (
            <li
              key={i}
              className="autocomplete-sugestao"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => escolher(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
