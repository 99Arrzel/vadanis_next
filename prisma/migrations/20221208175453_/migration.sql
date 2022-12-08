/*
  Warnings:

  - You are about to drop the column `imagenId` on the `DetallesAdquisiciones` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DetallesAdquisiciones" DROP CONSTRAINT "DetallesAdquisiciones_imagenId_fkey";

-- AlterTable
ALTER TABLE "DetallesAdquisiciones" DROP COLUMN "imagenId",
ADD COLUMN     "imagenesId" INTEGER;

-- AddForeignKey
ALTER TABLE "DetallesAdquisiciones" ADD CONSTRAINT "DetallesAdquisiciones_imagenesId_fkey" FOREIGN KEY ("imagenesId") REFERENCES "Imagenes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
