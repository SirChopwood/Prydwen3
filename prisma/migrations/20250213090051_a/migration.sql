/*
  Warnings:

  - Added the required column `code` to the `RRM_Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `RRM_Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user` to the `RRM_Request` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RRM_Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "metadata" TEXT,
    CONSTRAINT "RRM_Request_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "RRM_Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RRM_Request" ("id", "sessionId") SELECT "id", "sessionId" FROM "RRM_Request";
DROP TABLE "RRM_Request";
ALTER TABLE "new_RRM_Request" RENAME TO "RRM_Request";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
