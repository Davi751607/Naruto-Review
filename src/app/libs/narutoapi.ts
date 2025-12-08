

export interface NarutoAPICharacter {
  name?: string;
  images?: string[];
  personal?: { birthdate?: string; clan?: string };
}

// utils 
function norm(s: string) {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

function pickImageFromNarutoDB(c?: NarutoAPICharacter): string | undefined {
  const src = c?.images?.[0] ?? "";
  if (!src) return undefined;
  if (src.startsWith("http")) return src;
  
  return `https:${src.startsWith("//") ? src : "//" + src}`;
}

async function fetchNarutoDBList(url: string): Promise<NarutoAPICharacter[]> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any)?.characters)) return (data as any).characters;
  if (Array.isArray((data as any)?.results)) return (data as any).results;
  return [];
}

// ===== Jikan (só para imagem fallback) =====
async function fetchImageFromJikan(name: string): Promise<string | undefined> {
  try {
    const q = encodeURIComponent(name);
    const res = await fetch(`https://api.jikan.moe/v4/characters?q=${q}&limit=5`, {
      cache: "no-store",
    });
    if (!res.ok) return undefined;
    const json = await res.json();
    const items = Array.isArray(json?.data) ? json.data : [];
    for (const it of items) {
      const img =
        it?.images?.webp?.image_url ||
        it?.images?.jpg?.image_url ||
        it?.images?.jpg?.large_image_url ||
        it?.images?.webp?.large_image_url;
      if (typeof img === "string" && img.startsWith("http")) return img;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

// ===== Dattebayo (apenas para completar clã / aniversário) =====
async function fetchMetaFromDattebayo(name: string): Promise<{
  aniversario?: string;
  cla?: string;
}> {
  try {
    const q = encodeURIComponent(name);
    const res = await fetch(
      `https://dattebayo-api.onrender.com/characters?name=${q}`,
      { cache: "no-store" }
    );
    if (!res.ok) return {};
    const data = await res.json();
    const arr: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.characters)
      ? data.characters
      : [];
    if (!arr.length) return {};

    const alvoNorm = norm(name);
    const hit =
      arr.find((c) => norm(String(c?.name ?? "")) === alvoNorm) ??
      arr.find((c) => norm(String(c?.name ?? "")).includes(alvoNorm)) ??
      arr[0];

    return {
      aniversario: hit?.personal?.birthdate ?? hit?.personal?.birthDate ?? "",
      cla: hit?.personal?.clan ?? "",
    };
  } catch {
    return {};
  }
}

/**
 * Retorna { img?: string, aniversario?: string, cla?: string }
 * Prioridades:
 *   - IMAGEM: NarutoDB -> (se faltar) Jikan
 *   - METADADOS: NarutoDB -> (se faltar) Dattebayo
 */
export async function getNarutoCharacterByName(name: string): Promise<{
  img?: string;
  aniversario?: string;
  cla?: string;
}> {
  const alvo = (name ?? "").trim();
  if (!alvo) return { img: undefined, aniversario: "", cla: "" };

  const alvoNorm = norm(alvo);

  let img: string | undefined;
  let aniversario: string | undefined;
  let cla: string | undefined;

  // 1) NarutoDB 
  try {
    const viaSearch = await fetchNarutoDBList(
      `https://narutodb.xyz/api/character/search?name=${encodeURIComponent(alvo)}`
    );
    const exato = viaSearch.find((c) => norm(c.name ?? "") === alvoNorm);
    const parcial = exato ?? viaSearch.find((c) => norm(c.name ?? "").includes(alvoNorm));
    if (parcial) {
      img = pickImageFromNarutoDB(parcial) ?? img;
      aniversario = parcial.personal?.birthdate ?? aniversario;
      cla = parcial.personal?.clan ?? cla;
    }
  } catch {
    /* segue */
  }

  // 2) NarutoDB (paginação) se ainda faltou algo
  if (!img || !aniversario || !cla) {
    try {
      for (let page = 1; page <= 8; page++) {
        const lista = await fetchNarutoDBList(
          `https://narutodb.xyz/api/character?page=${page}&limit=200`
        );
        if (!lista.length) break;

        const exato = lista.find((c) => norm(c.name ?? "") === alvoNorm);
        const parcial = exato ?? lista.find((c) => norm(c.name ?? "").includes(alvoNorm));
        if (parcial) {
          img = img || pickImageFromNarutoDB(parcial);
          aniversario = aniversario || parcial.personal?.birthdate;
          cla = cla || parcial.personal?.clan;
          if (img && aniversario !== undefined && cla !== undefined) break;
        }
      }
    } catch {
      /* segue */
    }
  }

  // 3) Completa METADADOS com Dattebayo 
  if (!aniversario || !cla) {
    const meta = await fetchMetaFromDattebayo(alvo);
    aniversario = aniversario || meta.aniversario || "";
    cla = cla || meta.cla || "";
  }

  // 4) Se ainda faltou IMAGEM, usa Jikan
  if (!img) {
    img = await fetchImageFromJikan(alvo);
  }

  return {
    img, // pode continuar undefined 
    aniversario: aniversario ?? "",
    cla: cla ?? "",
  };
}
