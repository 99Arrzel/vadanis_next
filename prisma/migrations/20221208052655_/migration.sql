/*
  Warnings:

  - You are about to drop the column `AdquisicionId` on the `DetallesAdquisiciones` table. All the data in the column will be lost.
  - Added the required column `adquisicionId` to the `DetallesAdquisiciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comentario` to the `DetallesAdquisiciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marcaId` to the `DetallesAdquisiciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adquisicionId` to the `DetallesVenta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marcaId` to the `Productos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DetallesAdquisiciones" DROP CONSTRAINT "DetallesAdquisiciones_AdquisicionId_fkey";

-- AlterTable
ALTER TABLE "DetallesAdquisiciones" DROP COLUMN "AdquisicionId",
ADD COLUMN     "adquisicionId" INTEGER NOT NULL,
ADD COLUMN     "comentario" TEXT NOT NULL,
ADD COLUMN     "marcaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DetallesVenta" ADD COLUMN     "adquisicionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Productos" ADD COLUMN     "marcaId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DetallesAdquisiciones" ADD CONSTRAINT "DetallesAdquisiciones_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesAdquisiciones" ADD CONSTRAINT "DetallesAdquisiciones_adquisicionId_fkey" FOREIGN KEY ("adquisicionId") REFERENCES "Adquisiciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesVenta" ADD CONSTRAINT "DetallesVenta_adquisicionId_fkey" FOREIGN KEY ("adquisicionId") REFERENCES "DetallesAdquisiciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Productos" ADD CONSTRAINT "Productos_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
