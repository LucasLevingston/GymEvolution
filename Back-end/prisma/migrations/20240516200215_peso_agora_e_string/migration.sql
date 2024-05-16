-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pesosAntigos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "peso" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "bf" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "pesosAntigos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pesosAntigos" ("bf", "data", "id", "peso", "userId") SELECT "bf", "data", "id", "peso", "userId" FROM "pesosAntigos";
DROP TABLE "pesosAntigos";
ALTER TABLE "new_pesosAntigos" RENAME TO "pesosAntigos";
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
    "pesoAtual" TEXT
);
INSERT INTO "new_users" ("cep", "cidade", "email", "estado", "id", "nascimento", "nome", "numero", "pesoAtual", "rua", "senha", "sexo", "telefone") SELECT "cep", "cidade", "email", "estado", "id", "nascimento", "nome", "numero", "pesoAtual", "rua", "senha", "sexo", "telefone" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
