/*
  Warnings:

  - Added the required column `boardId` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orientation` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startX` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startY` to the `Word` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Board" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "width" INTEGER NOT NULL DEFAULT 15,
    "height" INTEGER NOT NULL DEFAULT 15
);

-- CreateTable
CREATE TABLE "PlacedTile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "boardId" INTEGER NOT NULL,
    "tileId" INTEGER NOT NULL,
    CONSTRAINT "PlacedTile_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlacedTile_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Word" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isValid" BOOLEAN,
    "boardId" INTEGER NOT NULL,
    "startX" INTEGER NOT NULL,
    "startY" INTEGER NOT NULL,
    "orientation" TEXT NOT NULL,
    CONSTRAINT "Word_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Word" ("id", "isValid") SELECT "id", "isValid" FROM "Word";
DROP TABLE "Word";
ALTER TABLE "new_Word" RENAME TO "Word";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
