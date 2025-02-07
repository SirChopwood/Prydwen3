/*
  Warnings:

  - The primary key for the `RRM_TwitchChannel` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RRM_Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'Closed',
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "lastUser" TEXT NOT NULL DEFAULT 'Unknown',
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "RRM_Session_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "RRM_TwitchChannel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RRM_Session" ("endTime", "id", "lastUser", "ownerId", "startTime", "status") SELECT "endTime", "id", "lastUser", "ownerId", "startTime", "status" FROM "RRM_Session";
DROP TABLE "RRM_Session";
ALTER TABLE "new_RRM_Session" RENAME TO "RRM_Session";
CREATE TABLE "new_RRM_TwitchChannel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "colour" TEXT NOT NULL DEFAULT '#ffffff',
    "image" TEXT
);
INSERT INTO "new_RRM_TwitchChannel" ("colour", "id", "image", "name") SELECT "colour", "id", "image", "name" FROM "RRM_TwitchChannel";
DROP TABLE "RRM_TwitchChannel";
ALTER TABLE "new_RRM_TwitchChannel" RENAME TO "RRM_TwitchChannel";
CREATE TABLE "new__Joined" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Joined_A_fkey" FOREIGN KEY ("A") REFERENCES "RRM_Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Joined_B_fkey" FOREIGN KEY ("B") REFERENCES "RRM_TwitchChannel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__Joined" ("A", "B") SELECT "A", "B" FROM "_Joined";
DROP TABLE "_Joined";
ALTER TABLE "new__Joined" RENAME TO "_Joined";
CREATE UNIQUE INDEX "_Joined_AB_unique" ON "_Joined"("A", "B");
CREATE INDEX "_Joined_B_index" ON "_Joined"("B");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
