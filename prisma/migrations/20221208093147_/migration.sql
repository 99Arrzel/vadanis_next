/*
  Warnings:

  - The values [PERSONAL] on the enum `PersonaTipo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PersonaTipo_new" AS ENUM ('CLIENTE', 'PROVEEDOR');
ALTER TABLE "Personas" ALTER COLUMN "tipo" DROP DEFAULT;
ALTER TABLE "Personas" ALTER COLUMN "tipo" TYPE "PersonaTipo_new" USING ("tipo"::text::"PersonaTipo_new");
ALTER TYPE "PersonaTipo" RENAME TO "PersonaTipo_old";
ALTER TYPE "PersonaTipo_new" RENAME TO "PersonaTipo";
DROP TYPE "PersonaTipo_old";
ALTER TABLE "Personas" ALTER COLUMN "tipo" SET DEFAULT 'CLIENTE';
COMMIT;
