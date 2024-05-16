/*
  Warnings:

  - You are about to drop the `DiaDeTreinoType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Peso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SerieType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TreinoAntigo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exercicios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `treinos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `treinoTypeId` on the `users` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DiaDeTreinoType";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Peso";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SerieType";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TreinoAntigo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "exercicios";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "treinos";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "semanaDeTreino" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "NumeroSemana" INTEGER NOT NULL,
    "atual" BOOLEAN NOT NULL,
    "informacoes" TEXT,
    "feito" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "semanaDeTreino_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pesosAntigos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "peso" REAL NOT NULL,
    "data" TEXT NOT NULL,
    "bf" REAL NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "pesosAntigos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiaDeTreino" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "grupo" TEXT NOT NULL,
    "diaDaSemana" TEXT NOT NULL,
    "feito" BOOLEAN NOT NULL,
    "observacoes" TEXT,
    "semanaDeTreinoId" TEXT NOT NULL,
    CONSTRAINT "DiaDeTreino_semanaDeTreinoId_fkey" FOREIGN KEY ("semanaDeTreinoId") REFERENCES "semanaDeTreino" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exercicio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "variacao" TEXT,
    "repeticoes" INTEGER NOT NULL,
    "quantidadeSeries" INTEGER NOT NULL,
    "feito" BOOLEAN NOT NULL,
    "diaDeTreinoId" TEXT NOT NULL,
    CONSTRAINT "Exercicio_diaDeTreinoId_fkey" FOREIGN KEY ("diaDeTreinoId") REFERENCES "DiaDeTreino" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Serie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serieIndex" INTEGER,
    "repeticoes" INTEGER,
    "carga" INTEGER,
    "exercicioId" TEXT NOT NULL,
    CONSTRAINT "Serie_exercicioId_fkey" FOREIGN KEY ("exercicioId") REFERENCES "Exercicio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT,
    "sexo" TEXT,
    "rua" TEXT,
    "numero" TEXT,
    "cep" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "nascimento" TEXT,
    "telefone" TEXT,
    "pesoAtual" REAL
);
INSERT INTO "new_users" ("cep", "cidade", "email", "estado", "id", "nascimento", "nome", "numero", "pesoAtual", "rua", "senha", "sexo", "telefone") SELECT "cep", "cidade", "email", "estado", "id", "nascimento", "nome", "numero", "pesoAtual", "rua", "senha", "sexo", "telefone" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
