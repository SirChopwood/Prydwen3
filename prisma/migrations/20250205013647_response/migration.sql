/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "RRM_Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'Closed',
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "lastUser" TEXT NOT NULL DEFAULT 'Unknown',
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "RRM_Session_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "RRM_TwitchChannel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RRM_Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" INTEGER NOT NULL,
    CONSTRAINT "RRM_Request_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "RRM_Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RRM_TwitchChannel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "colour" TEXT NOT NULL DEFAULT '#ffffff',
    "image" TEXT
);

-- CreateTable
CREATE TABLE "_Joined" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_Joined_A_fkey" FOREIGN KEY ("A") REFERENCES "RRM_Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Joined_B_fkey" FOREIGN KEY ("B") REFERENCES "RRM_TwitchChannel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_Joined_AB_unique" ON "_Joined"("A", "B");

-- CreateIndex
CREATE INDEX "_Joined_B_index" ON "_Joined"("B");
