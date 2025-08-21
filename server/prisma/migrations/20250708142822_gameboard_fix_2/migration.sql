-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Word" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isValid" BOOLEAN,
    "boardId" INTEGER,
    "startX" INTEGER,
    "startY" INTEGER,
    "orientation" TEXT,
    CONSTRAINT "Word_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Word" ("boardId", "id", "isValid", "orientation", "startX", "startY") SELECT "boardId", "id", "isValid", "orientation", "startX", "startY" FROM "Word";
DROP TABLE "Word";
ALTER TABLE "new_Word" RENAME TO "Word";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
