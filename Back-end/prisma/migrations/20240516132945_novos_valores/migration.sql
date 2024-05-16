-- CreateTable
CREATE TABLE "Historico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ocorrido" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Historico_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Peso" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "peso" REAL NOT NULL,
    "data" TEXT NOT NULL,
    "bf" REAL NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Peso_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "treinos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "semana" INTEGER NOT NULL,
    "informacoes" TEXT
);

-- CreateTable
CREATE TABLE "DiaDeTreinoType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "grupo" TEXT NOT NULL,
    "diaDaSemana" TEXT NOT NULL,
    "feito" BOOLEAN NOT NULL,
    "observacoes" TEXT,
    "treinoId" INTEGER NOT NULL,
    CONSTRAINT "DiaDeTreinoType_treinoId_fkey" FOREIGN KEY ("treinoId") REFERENCES "treinos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "exercicios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "variacao" TEXT,
    "repeticoes" INTEGER NOT NULL,
    "quantidadeSeries" INTEGER NOT NULL,
    "feito" BOOLEAN NOT NULL,
    "diaDeTreinoTypeId" INTEGER,
    CONSTRAINT "exercicios_diaDeTreinoTypeId_fkey" FOREIGN KEY ("diaDeTreinoTypeId") REFERENCES "DiaDeTreinoType" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SerieType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repeticoes" INTEGER,
    "carga" INTEGER,
    "serie" INTEGER,
    "exercicioTypeId" INTEGER,
    "treinoAntigoId" INTEGER,
    CONSTRAINT "SerieType_exercicioTypeId_fkey" FOREIGN KEY ("exercicioTypeId") REFERENCES "exercicios" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SerieType_treinoAntigoId_fkey" FOREIGN KEY ("treinoAntigoId") REFERENCES "TreinoAntigo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TreinoAntigo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "semana" INTEGER NOT NULL,
    "treinoId" INTEGER NOT NULL,
    "userId" TEXT,
    CONSTRAINT "TreinoAntigo_treinoId_fkey" FOREIGN KEY ("treinoId") REFERENCES "treinos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TreinoAntigo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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
    "pesoAtual" REAL,
    "treinoTypeId" INTEGER,
    CONSTRAINT "users_treinoTypeId_fkey" FOREIGN KEY ("treinoTypeId") REFERENCES "treinos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("email", "id", "senha") SELECT "email", "id", "senha" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
