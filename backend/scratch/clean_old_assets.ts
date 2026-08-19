import { prisma } from "../src/lib/prisma.js";
import fs from "fs/promises";
import path from "path";

async function main() {
  const assets = await prisma.asset.findMany();
  for (const asset of assets) {
    const filePath = path.join(process.cwd(), asset.objectKey);
    try {
      const stat = await fs.stat(filePath);
      if (stat.size === 0) {
        console.log(`Deleting 0-byte asset file: ${asset.objectKey}`);
        await prisma.asset.delete({ where: { id: asset.id } });
        await fs.unlink(filePath).catch(() => {});
      }
    } catch {
      // File doesn't exist
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
