-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RRM_Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'Closed',
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
