import { promises as fs } from "fs";
import path from "path";

class ConexaoBD {
  // pasta onde ficará o arquivo JSON
  private static DB_DIR = path.join(process.cwd(), "src", "app", "db");

  private static resolvePath(arquivo: string) {
    return path.join(this.DB_DIR, arquivo);
  }

  // Garante que a pasta exista
  private static async ensureDir() {
    try {
      await fs.mkdir(this.DB_DIR, { recursive: true });
    } catch {
      
    }
  }

  // Lê o JSON e devolve como array/objeto
  static async retornaBD<T = any>(arquivo: string): Promise<T> {
    await this.ensureDir();
    const filePath = this.resolvePath(arquivo);

    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data) as T;
    } catch (err: any) {
      // Se o arquivo não existir, cria com []
      if (err?.code === "ENOENT") {
        await fs.writeFile(filePath, "[]", "utf-8");
        return JSON.parse("[]") as T;
      }
      throw err;
    }
  }

  // Grava o JSON formatado
  static async armazenaBD(arquivo: string, dados: any): Promise<void> {
    await this.ensureDir();
    const filePath = this.resolvePath(arquivo);
    const conteudo = JSON.stringify(dados, null, 2);
    await fs.writeFile(filePath, conteudo, "utf-8");
  }
}

export default ConexaoBD;
