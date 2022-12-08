/*
  Warnings:

  - You are about to drop the column `estado` on the `CategoriaProductos` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CategoriaProductos` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Marcas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CategoriaProductos" DROP COLUMN "estado",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Marcas" DROP COLUMN "estado";
