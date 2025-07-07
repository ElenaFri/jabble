/*
  Warnings:

  - You are about to drop the column `wordId` on the `Tile` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "letter" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "playerId" INTEGER,
    CONSTRAINT "Tile_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tile" ("id", "letter", "playerId", "value") SELECT "id", "letter", "playerId", "value" FROM "Tile";
DROP TABLE "Tile";
ALTER TABLE "new_Tile" RENAME TO "Tile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
