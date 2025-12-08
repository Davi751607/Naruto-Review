// src/app/libs/naruto-names.ts
export const NARUTO_NAMES: string[] = [
  
  "Naruto Uzumaki", "Sasuke Uchiha", "Sakura Haruno", "Kakashi Hatake",
  "Hinata Hyuga", "Shikamaru Nara", "Ino Yamanaka", "Choji Akimichi",
  "Rock Lee", "Neji Hyuga", "Tenten",

  
  "Jiraiya", "Tsunade", "Orochimaru",
  "Minato Namikaze", "Kushina Uzumaki",
  "Hiruzen Sarutobi", "Hashirama Senju", "Tobirama Senju",
  "Danzo Shimura",

  
  "Itachi Uchiha", "Madara Uchiha", "Obito Uchiha",
  "Nagato", "Pain", "Konan",
  "Deidara", "Sasori", "Hidan", "Kakuzu",
  "Kisame Hoshigaki",

  
  "Gaara", "Kankuro", "Temari",
  "Killer B", "A (Quarto Raikage)", "Mei Terumi", "Onoki",
  "Chojuro", "Darui",

  
  "Yamato", "Sai", "Anko Mitarashi", "Iruka Umino",
  "Asuma Sarutobi", "Kurenai Yuhi", "Might Guy",
  "Shino Aburame", "Kiba Inuzuka", "Akamaru",
  "Zabuza Momochi", "Haku",
  "Kabuto Yakushi", "Kimimaro",
  "Shisui Uchiha",

 
  "White Zetsu", "Black Zetsu",

];

// Ajuda a normalizar buscas (ignora acentos/maiúsculas)
export const norm = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
