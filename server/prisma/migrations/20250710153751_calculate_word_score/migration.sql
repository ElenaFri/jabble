-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlacedTile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "boardId" INTEGER NOT NULL,
    "tileId" INTEGER NOT NULL,
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "PlacedTile_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlacedTile_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlacedTile" ("boardId", "id", "tileId", "x", "y") SELECT "boardId", "id", "tileId", "x", "y" FROM "PlacedTile";
DROP TABLE "PlacedTile";
ALTER TABLE "new_PlacedTile" RENAME TO "PlacedTile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
