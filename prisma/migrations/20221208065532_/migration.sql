-- CreateEnum
CREATE TYPE "UsuarioTipo" AS ENUM ('USUARIO', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tipo" "UsuarioTipo" NOT NULL DEFAULT 'USUARIO';
