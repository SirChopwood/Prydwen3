-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RRM_Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "metadata" TEXT
);
INSERT INTO "new_RRM_Request" ("code", "id", "metadata", "session", "text", "user") SELECT "code", "id", "metadata", "session", "text", "user" FROM "RRM_Request";
DROP TABLE "RRM_Request";
ALTER TABLE "new_RRM_Request" RENAME TO "RRM_Request";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
