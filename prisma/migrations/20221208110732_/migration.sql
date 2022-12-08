/*
  Warnings:

  - You are about to drop the column `marcaId` on the `DetallesAdquisiciones` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DetallesAdquisiciones" DROP CONSTRAINT "DetallesAdquisiciones_marcaId_fkey";

-- AlterTable
ALTER TABLE "DetallesAdquisiciones" DROP COLUMN "marcaId",
ADD COLUMN     "marcasId" INTEGER;

-- AddForeignKey
ALTER TABLE "DetallesAdquisiciones" ADD CONSTRAINT "DetallesAdquisiciones_marcasId_fkey" FOREIGN KEY ("marcasId") REFERENCES "Marcas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
