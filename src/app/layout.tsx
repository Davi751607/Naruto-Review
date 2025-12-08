import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import Header from "./ui/header";
import Footer from "./ui/footer";
import { Toaster } from "react-hot-toast";

const Font = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Naruto Reviews",
  description: "Projeto final — CRUD de avaliações de personagens de Naruto",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={Font.className}>
      <body>
        <Header />
        {children}
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
