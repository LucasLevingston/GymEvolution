/*
  Warnings:

  - You are about to drop the `History` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `diaDeTreino` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exercicio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pesosAntigos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `semanaDeTreino` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `serie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "History";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "diaDeTreino";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "exercicio";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pesosAntigos";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "semanaDeTreino";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "serie";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "trainingWeeks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekNumber" INTEGER NOT NULL,
    "current" BOOLEAN NOT NULL,
    "information" TEXT,
    "done" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "trainingWeeks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "histories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "weights" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weight" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "bf" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "weights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trainingDays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "group" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL,
    "comments" TEXT,
    "trainingWeekId" TEXT NOT NULL,
    CONSTRAINT "trainingDays_trainingWeekId_fkey" FOREIGN KEY ("trainingWeekId") REFERENCES "trainingWeeks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "variation" TEXT,
    "repetitions" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "done" BOOLEAN NOT NULL,
    "trainingDayId" TEXT NOT NULL,
    CONSTRAINT "exercises_trainingDayId_fkey" FOREIGN KEY ("trainingDayId") REFERENCES "trainingDays" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "series" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seriesIndex" INTEGER,
    "repetitions" INTEGER,
    "weight" INTEGER,
    "exerciseId" TEXT NOT NULL,
    CONSTRAINT "series_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "diets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekNumber" INTEGER NOT NULL,
    "totalCalories" INTEGER,
    "totalProtein" REAL,
    "totalCarbohydrates" REAL,
    "totalFat" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "diets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "calories" INTEGER,
    "protein" REAL,
    "carbohydrates" REAL,
    "fat" REAL,
    "servingSize" TEXT,
    "mealType" TEXT,
    "day" INTEGER,
    "hour" TEXT,
    "isCompleted" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "dietId" TEXT,
    CONSTRAINT "meals_dietId_fkey" FOREIGN KEY ("dietId") REFERENCES "diets" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
