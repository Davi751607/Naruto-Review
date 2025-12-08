import "@/app/styles/footer.css";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <section className="section-contact">
        <p style={{ textAlign: "center" }}>
          Para mais informações, acesse:
        </p>

        <Link 
          href="https://github.com/Davi751607/Naruto-Review" 
          target="_blank"
        >
          <Image 
            className="gitIcon" 
            src="/github-icon.png" 
            alt="Ícone do GitHub"
            width={32}
            height={32}
          />
        </Link>
      </section>
    </footer>
  );
}
