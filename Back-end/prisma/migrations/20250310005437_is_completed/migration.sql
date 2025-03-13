/*
  Warnings:

  - You are about to drop the column `done` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `done` on the `trainingDays` table. All the data in the column will be lost.
  - You are about to drop the column `done` on the `trainingWeeks` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_diets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekNumber" INTEGER NOT NULL,
    "totalCalories" INTEGER,
    "totalProtein" REAL,
    "totalCarbohydrates" REAL,
    "totalFat" REAL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "diets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_diets" ("createdAt", "id", "totalCalories", "totalCarbohydrates", "totalFat", "totalProtein", "updatedAt", "userId", "weekNumber") SELECT "createdAt", "id", "totalCalories", "totalCarbohydrates", "totalFat", "totalProtein", "updatedAt", "userId", "weekNumber" FROM "diets";
DROP TABLE "diets";
ALTER TABLE "new_diets" RENAME TO "diets";
CREATE TABLE "new_exercises" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "variation" TEXT,
    "repetitions" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "trainingDayId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "exercises_trainingDayId_fkey" FOREIGN KEY ("trainingDayId") REFERENCES "trainingDays" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_exercises" ("createdAt", "id", "name", "repetitions", "sets", "trainingDayId", "updatedAt", "variation") SELECT "createdAt", "id", "name", "repetitions", "sets", "trainingDayId", "updatedAt", "variation" FROM "exercises";
DROP TABLE "exercises";
ALTER TABLE "new_exercises" RENAME TO "exercises";
CREATE TABLE "new_mealItems" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "calories" INTEGER,
    "protein" REAL,
    "carbohydrates" REAL,
    "fat" REAL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "mealId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "mealItems_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_mealItems" ("calories", "carbohydrates", "createdAt", "fat", "id", "mealId", "name", "protein", "quantity", "updatedAt") SELECT "calories", "carbohydrates", "createdAt", "fat", "id", "mealId", "name", "protein", "quantity", "updatedAt" FROM "mealItems";
DROP TABLE "mealItems";
ALTER TABLE "new_mealItems" RENAME TO "mealItems";
CREATE TABLE "new_trainingDays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "group" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "comments" TEXT,
    "trainingWeekId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "trainingDays_trainingWeekId_fkey" FOREIGN KEY ("trainingWeekId") REFERENCES "trainingWeeks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_trainingDays" ("comments", "createdAt", "dayOfWeek", "group", "id", "trainingWeekId", "updatedAt") SELECT "comments", "createdAt", "dayOfWeek", "group", "id", "trainingWeekId", "updatedAt" FROM "trainingDays";
DROP TABLE "trainingDays";
ALTER TABLE "new_trainingDays" RENAME TO "trainingDays";
CREATE TABLE "new_trainingWeeks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekNumber" INTEGER NOT NULL,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "information" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "trainingWeeks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_trainingWeeks" ("createdAt", "current", "id", "information", "updatedAt", "userId", "weekNumber") SELECT "createdAt", "current", "id", "information", "updatedAt", "userId", "weekNumber" FROM "trainingWeeks";
DROP TABLE "trainingWeeks";
ALTER TABLE "new_trainingWeeks" RENAME TO "trainingWeeks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
