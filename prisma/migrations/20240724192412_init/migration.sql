-- CreateTable
CREATE TABLE "NewsPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "author" TEXT,
    "theme" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsPost_title_source_key" ON "NewsPost"("title", "source");
