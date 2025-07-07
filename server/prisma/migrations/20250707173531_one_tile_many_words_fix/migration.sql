/*
  Warnings:

  - The primary key for the `TilesOnWord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `TilesOnWord` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TilesOnWord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wordId" INTEGER NOT NULL,
    "tileId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "TilesOnWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TilesOnWord_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TilesOnWord" ("position", "tileId", "wordId") SELECT "position", "tileId", "wordId" FROM "TilesOnWord";
DROP TABLE "TilesOnWord";
ALTER TABLE "new_TilesOnWord" RENAME TO "TilesOnWord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
