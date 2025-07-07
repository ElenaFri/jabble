-- CreateTable
CREATE TABLE "TilesOnWord" (
    "wordId" INTEGER NOT NULL,
    "tileId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    PRIMARY KEY ("wordId", "tileId"),
    CONSTRAINT "TilesOnWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TilesOnWord_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
