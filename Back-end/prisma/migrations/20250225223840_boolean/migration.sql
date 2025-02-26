-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_exercises" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "variation" TEXT,
    "repetitions" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "trainingDayId" TEXT NOT NULL,
    CONSTRAINT "exercises_trainingDayId_fkey" FOREIGN KEY ("trainingDayId") REFERENCES "trainingDays" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_exercises" ("done", "id", "name", "repetitions", "sets", "trainingDayId", "variation") SELECT "done", "id", "name", "repetitions", "sets", "trainingDayId", "variation" FROM "exercises";
DROP TABLE "exercises";
ALTER TABLE "new_exercises" RENAME TO "exercises";
CREATE TABLE "new_meals" (
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
    "isCompleted" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "dietId" TEXT,
    CONSTRAINT "meals_dietId_fkey" FOREIGN KEY ("dietId") REFERENCES "diets" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_meals" ("calories", "carbohydrates", "createdAt", "day", "dietId", "fat", "hour", "id", "isCompleted", "mealType", "name", "protein", "servingSize", "updatedAt") SELECT "calories", "carbohydrates", "createdAt", "day", "dietId", "fat", "hour", "id", "isCompleted", "mealType", "name", "protein", "servingSize", "updatedAt" FROM "meals";
DROP TABLE "meals";
ALTER TABLE "new_meals" RENAME TO "meals";
CREATE TABLE "new_trainingDays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "group" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "comments" TEXT,
    "trainingWeekId" TEXT NOT NULL,
    CONSTRAINT "trainingDays_trainingWeekId_fkey" FOREIGN KEY ("trainingWeekId") REFERENCES "trainingWeeks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_trainingDays" ("comments", "dayOfWeek", "done", "group", "id", "trainingWeekId") SELECT "comments", "dayOfWeek", "done", "group", "id", "trainingWeekId" FROM "trainingDays";
DROP TABLE "trainingDays";
ALTER TABLE "new_trainingDays" RENAME TO "trainingDays";
CREATE TABLE "new_trainingWeeks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekNumber" INTEGER NOT NULL,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "information" TEXT,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    CONSTRAINT "trainingWeeks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_trainingWeeks" ("current", "done", "id", "information", "userId", "weekNumber") SELECT "current", "done", "id", "information", "userId", "weekNumber" FROM "trainingWeeks";
DROP TABLE "trainingWeeks";
ALTER TABLE "new_trainingWeeks" RENAME TO "trainingWeeks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
