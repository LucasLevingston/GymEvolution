/*
  Warnings:

  - You are about to drop the `DiaDeTreino` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exercicio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Historico` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Serie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `data` on the `pesosAntigos` table. All the data in the column will be lost.
  - You are about to drop the column `peso` on the `pesosAntigos` table. All the data in the column will be lost.
  - You are about to drop the column `NumeroSemana` on the `semanaDeTreino` table. All the data in the column will be lost.
  - You are about to drop the column `atual` on the `semanaDeTreino` table. All the data in the column will be lost.
  - You are about to drop the column `feito` on the `semanaDeTreino` table. All the data in the column will be lost.
  - You are about to drop the column `informacoes` on the `semanaDeTreino` table. All the data in the column will be lost.
  - You are about to drop the column `cep` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `cidade` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `nascimento` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `pesoAtual` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `rua` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `sexo` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `users` table. All the data in the column will be lost.
  - Added the required column `date` to the `pesosAntigos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `pesosAntigos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current` to the `semanaDeTreino` table without a default value. This is not possible if the table is not empty.
  - Added the required column `done` to the `semanaDeTreino` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekNumber` to the `semanaDeTreino` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DiaDeTreino";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Exercicio";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Historico";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Serie";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "diaDeTreino" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "group" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL,
    "comments" TEXT,
    "trainingWeekId" TEXT NOT NULL,
    CONSTRAINT "diaDeTreino_trainingWeekId_fkey" FOREIGN KEY ("trainingWeekId") REFERENCES "semanaDeTreino" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "exercicio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "variation" TEXT,
    "repetitions" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "done" BOOLEAN NOT NULL,
    "trainingDayId" TEXT NOT NULL,
    CONSTRAINT "exercicio_trainingDayId_fkey" FOREIGN KEY ("trainingDayId") REFERENCES "diaDeTreino" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "serie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seriesIndex" INTEGER,
    "repetitions" INTEGER,
    "weight" INTEGER,
    "exerciseId" TEXT NOT NULL,
    CONSTRAINT "serie_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercicio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pesosAntigos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weight" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "bf" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "pesosAntigos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pesosAntigos" ("bf", "id", "userId") SELECT "bf", "id", "userId" FROM "pesosAntigos";
DROP TABLE "pesosAntigos";
ALTER TABLE "new_pesosAntigos" RENAME TO "pesosAntigos";
CREATE TABLE "new_semanaDeTreino" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekNumber" INTEGER NOT NULL,
    "current" BOOLEAN NOT NULL,
    "information" TEXT,
    "done" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "semanaDeTreino_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_semanaDeTreino" ("id", "userId") SELECT "id", "userId" FROM "semanaDeTreino";
DROP TABLE "semanaDeTreino";
ALTER TABLE "new_semanaDeTreino" RENAME TO "semanaDeTreino";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "sex" TEXT,
    "street" TEXT,
    "number" TEXT,
    "zipCode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "birthDate" TEXT,
    "phone" TEXT,
    "currentWeight" TEXT
);
INSERT INTO "new_users" ("email", "id") SELECT "email", "id" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
