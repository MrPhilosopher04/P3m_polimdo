/*
  Warnings:

  - You are about to alter the column `kategori` on the `skema` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.
  - You are about to drop the `kegiatan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kegiatananggota` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[kode]` on the table `skema` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `jurusan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `prodi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kode` to the `skema` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `skema` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `kegiatan` DROP FOREIGN KEY `Kegiatan_ketuaId_fkey`;

-- DropForeignKey
ALTER TABLE `kegiatan` DROP FOREIGN KEY `Kegiatan_skemaId_fkey`;

-- DropForeignKey
ALTER TABLE `kegiatananggota` DROP FOREIGN KEY `KegiatanAnggota_kegiatanId_fkey`;

-- DropForeignKey
ALTER TABLE `kegiatananggota` DROP FOREIGN KEY `KegiatanAnggota_userId_fkey`;

-- DropForeignKey
ALTER TABLE `prodi` DROP FOREIGN KEY `Prodi_jurusanId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_jurusanId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_prodiId_fkey`;

-- AlterTable
ALTER TABLE `jurusan` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `status` ENUM('AKTIF', 'NONAKTIF') NOT NULL DEFAULT 'AKTIF',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `ketua_jurusan` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `prodi` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `status` ENUM('AKTIF', 'NONAKTIF') NOT NULL DEFAULT 'AKTIF',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `ketua_prodi` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `skema` ADD COLUMN `batas_anggota` INTEGER NOT NULL DEFAULT 5,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dana_max` DECIMAL(15, 2) NULL,
    ADD COLUMN `dana_min` DECIMAL(15, 2) NULL,
    ADD COLUMN `kode` VARCHAR(191) NOT NULL,
    ADD COLUMN `luaran_tambahan` TEXT NULL,
    ADD COLUMN `luaran_wajib` TEXT NULL,
    ADD COLUMN `status` ENUM('AKTIF', 'NONAKTIF') NOT NULL DEFAULT 'AKTIF',
    ADD COLUMN `tahun_aktif` VARCHAR(191) NULL,
    ADD COLUMN `tanggal_buka` DATETIME(3) NULL,
    ADD COLUMN `tanggal_tutup` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `kategori` ENUM('PENELITIAN', 'PENGABDIAN', 'HIBAH_INTERNAL', 'HIBAH_EKSTERNAL') NOT NULL;

-- DropTable
DROP TABLE `kegiatan`;

-- DropTable
DROP TABLE `kegiatananggota`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nip` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('DOSEN', 'MAHASISWA', 'ADMIN', 'REVIEWER_PENELITIAN', 'REVIEWER_PENGABDIAN', 'KAPRODI', 'KAJUR') NOT NULL,
    `no_telp` VARCHAR(191) NULL,
    `no_rek` VARCHAR(191) NULL,
    `id_sinta` VARCHAR(191) NULL,
    `status` ENUM('AKTIF', 'NONAKTIF') NOT NULL DEFAULT 'AKTIF',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_nip_key`(`nip`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_jurusan` (
    `userId` INTEGER NOT NULL,
    `jurusanId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `jurusanId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_prodi` (
    `userId` INTEGER NOT NULL,
    `prodiId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `prodiId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proposals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `abstrak` TEXT NOT NULL,
    `kata_kunci` VARCHAR(191) NULL,
    `skemaId` INTEGER NOT NULL,
    `ketuaId` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `dana_diusulkan` DECIMAL(15, 2) NULL,
    `status` ENUM('DRAFT', 'SUBMITTED', 'REVIEW', 'APPROVED', 'REJECTED', 'REVISION', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `tanggal_submit` DATETIME(3) NULL,
    `tanggal_deadline` DATETIME(3) NULL,
    `catatan_reviewer` TEXT NULL,
    `skor_akhir` DECIMAL(5, 2) NULL,
    `reviewerId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `proposals_skemaId_idx`(`skemaId`),
    INDEX `proposals_reviewerId_idx`(`reviewerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proposal_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proposalId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `peran` ENUM('KETUA', 'ANGGOTA') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `proposal_members_proposalId_userId_key`(`proposalId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proposal_documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proposalId` INTEGER NOT NULL,
    `nama_dokumen` VARCHAR(191) NOT NULL,
    `jenis_dokumen` VARCHAR(191) NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,
    `file_size` INTEGER NULL,
    `mime_type` VARCHAR(191) NULL,
    `uploadedBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proposalId` INTEGER NOT NULL,
    `reviewerId` INTEGER NOT NULL,
    `skor_total` DECIMAL(5, 2) NULL,
    `catatan` TEXT NULL,
    `rekomendasi` ENUM('LAYAK', 'TIDAK_LAYAK', 'REVISI') NOT NULL,
    `tanggal_review` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_final` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `reviews_proposalId_reviewerId_key`(`proposalId`, `reviewerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_criteria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reviewId` INTEGER NOT NULL,
    `kriteria` VARCHAR(191) NOT NULL,
    `skor` DECIMAL(5, 2) NOT NULL,
    `bobot` DECIMAL(3, 2) NOT NULL DEFAULT 1.0,
    `keterangan` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengumuman` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `konten` TEXT NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `prioritas` VARCHAR(191) NOT NULL DEFAULT 'normal',
    `status` ENUM('AKTIF', 'NONAKTIF') NOT NULL DEFAULT 'AKTIF',
    `createdBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `skema_kode_key` ON `skema`(`kode`);

-- AddForeignKey
ALTER TABLE `prodi` ADD CONSTRAINT `prodi_jurusanId_fkey` FOREIGN KEY (`jurusanId`) REFERENCES `jurusan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_jurusan` ADD CONSTRAINT `user_jurusan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_jurusan` ADD CONSTRAINT `user_jurusan_jurusanId_fkey` FOREIGN KEY (`jurusanId`) REFERENCES `jurusan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_prodi` ADD CONSTRAINT `user_prodi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_prodi` ADD CONSTRAINT `user_prodi_prodiId_fkey` FOREIGN KEY (`prodiId`) REFERENCES `prodi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proposals` ADD CONSTRAINT `proposals_skemaId_fkey` FOREIGN KEY (`skemaId`) REFERENCES `skema`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proposals` ADD CONSTRAINT `proposals_ketuaId_fkey` FOREIGN KEY (`ketuaId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proposals` ADD CONSTRAINT `proposals_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proposal_members` ADD CONSTRAINT `proposal_members_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proposal_members` ADD CONSTRAINT `proposal_members_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proposal_documents` ADD CONSTRAINT `proposal_documents_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proposal_documents` ADD CONSTRAINT `proposal_documents_uploadedBy_fkey` FOREIGN KEY (`uploadedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_criteria` ADD CONSTRAINT `review_criteria_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
