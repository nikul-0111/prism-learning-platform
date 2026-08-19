import { prisma } from "../src/lib/prisma.js";

async function main() {
  const assets = await prisma.asset.findMany();
  for (const asset of assets) {
    await prisma.asset.update({
      where: { id: asset.id },
      data: {
        status: "READY",
        transcodeProgress: 100,
        masterPlaylistKey: asset.objectKey || "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
    });
  }
  console.log("Updated assets count:", assets.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
