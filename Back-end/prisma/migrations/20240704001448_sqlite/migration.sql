-- CreateTable
CREATE TABLE "users" (
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
    "pesoAtual" TEXT
);

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
CREATE TABLE "Historico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ocorrido" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Historico_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pesosAntigos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "peso" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "bf" TEXT NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
