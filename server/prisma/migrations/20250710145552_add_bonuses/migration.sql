-- CreateTable
CREATE TABLE "BoardBonus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "boardId" INTEGER NOT NULL,
    CONSTRAINT "BoardBonus_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BoardBonus_boardId_x_y_key" ON "BoardBonus"("boardId", "x", "y");
