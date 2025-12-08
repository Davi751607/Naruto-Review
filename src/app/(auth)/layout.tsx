import "@/app/styles/login.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="img-background">
      {children}

      <section className="introducao">
        <h2>
          Bem-vindo ao Naruto Reviews <br />
          o seu próprio mundo ninja!
        </h2>

        <p>
          Aqui você pode explorar personagens icônicos do universo de Naruto e
          montar seu próprio ranking shinobi. Avalie, edite e registre seus
          favoritos — dos heróis da Folha aos lendários da Akatsuki.
        </p>

        <p>Quem será o verdadeiro Hokage do seu coração? 🍥🔥</p>
      </section>
    </main>
  );
}
