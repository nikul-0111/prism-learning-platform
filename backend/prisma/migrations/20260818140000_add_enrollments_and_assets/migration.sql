-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('UPLOADING', 'UPLOADED', 'VALIDATING', 'QUEUED', 'PROBING', 'TRANSCODING', 'PACKAGING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "uploadId" TEXT,
    "objectKey" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "fileSize" BIGINT NOT NULL,
    "declaredContentType" TEXT NOT NULL,
    "actualContentType" TEXT,
    "status" "AssetStatus" NOT NULL DEFAULT 'UPLOADING',
    "transcodeProgress" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "masterPlaylistKey" TEXT,
    "thumbnailKey" TEXT,
    "spriteSheetKey" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_userId_courseId_key" ON "enrollments"("userId", "courseId");

-- CreateIndex
CREATE INDEX "enrollments_userId_idx" ON "enrollments"("userId");

-- CreateIndex
CREATE INDEX "enrollments_courseId_idx" ON "enrollments"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "assets_lessonId_key" ON "assets"("lessonId");

-- CreateIndex
CREATE INDEX "assets_lessonId_idx" ON "assets"("lessonId");

-- CreateIndex
CREATE INDEX "assets_status_idx" ON "assets"("status");

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
