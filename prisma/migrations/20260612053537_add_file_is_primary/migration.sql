-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StartupFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startupId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StartupFile_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_StartupFile" ("createdAt", "filename", "id", "mimeType", "originalName", "size", "startupId") SELECT "createdAt", "filename", "id", "mimeType", "originalName", "size", "startupId" FROM "StartupFile";
DROP TABLE "StartupFile";
ALTER TABLE "new_StartupFile" RENAME TO "StartupFile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
