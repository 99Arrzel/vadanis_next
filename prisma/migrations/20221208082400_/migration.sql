-- DropForeignKey
ALTER TABLE "Personas" DROP CONSTRAINT "Personas_userId_fkey";

-- AlterTable
ALTER TABLE "Personas" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Personas" ADD CONSTRAINT "Personas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
