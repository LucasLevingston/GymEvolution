-- CreateTable
CREATE TABLE "MealItems" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "calories" INTEGER,
    "protein" REAL,
    "carbohydrates" REAL,
    "mealId" TEXT,
    CONSTRAINT "MealItems_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
