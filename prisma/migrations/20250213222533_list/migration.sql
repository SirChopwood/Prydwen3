/*
  Warnings:

  - You are about to drop the column `sessionId` on the `RRM_Request` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RRM_Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session" INTEGER NOT NULL DEFAULT 8,
    "text" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "metadata" TEXT
);
INSERT INTO "new_RRM_Request" ("code", "id", "metadata", "text", "user") SELECT "code", "id", "metadata", "text", "user" FROM "RRM_Request";
DROP TABLE "RRM_Request";
ALTER TABLE "new_RRM_Request" RENAME TO "RRM_Request";
CREATE TABLE "new_RRM_Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requests" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'Locked',
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "lastUser" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "RRM_Session_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "RRM_TwitchChannel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RRM_Session" ("endTime", "id", "lastUser", "ownerId", "startTime", "status") SELECT "endTime", "id", "lastUser", "ownerId", "startTime", "status" FROM "RRM_Session";
DROP TABLE "RRM_Session";
ALTER TABLE "new_RRM_Session" RENAME TO "RRM_Session";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
