/*
  Warnings:

  - You are about to drop the column `createdBy` on the `pengumuman` table. All the data in the column will be lost.
  - You are about to drop the column `prioritas` on the `pengumuman` table. All the data in the column will be lost.
  - You are about to alter the column `peran` on the `proposal_members` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.
  - You are about to drop the column `tanggal_deadline` on the `proposals` table. All the data in the column will be lost.
  - The values [CANCELLED] on the enum `proposals_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `is_final` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `luaran_tambahan` on the `skema` table. All the data in the column will be lost.
  - You are about to drop the column `id_sinta` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `jurusan_mahasiswa` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `no_rek` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `bidang_keahlian` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to drop the `jurusan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prodi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proposal_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `review_criteria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_jurusan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_prodi` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `tahun_aktif` on table `skema` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `prodi` DROP FOREIGN KEY `prodi_jurusanId_fkey`;

-- DropForeignKey
ALTER TABLE `proposal_documents` DROP FOREIGN KEY `proposal_documents_proposalId_fkey`;

-- DropForeignKey
ALTER TABLE `proposal_documents` DROP FOREIGN KEY `proposal_documents_uploadedBy_fkey`;

-- DropForeignKey
ALTER TABLE `review_criteria` DROP FOREIGN KEY `review_criteria_reviewId_fkey`;

-- DropForeignKey
ALTER TABLE `user_jurusan` DROP FOREIGN KEY `user_jurusan_jurusanId_fkey`;

-- DropForeignKey
ALTER TABLE `user_jurusan` DROP FOREIGN KEY `user_jurusan_userId_fkey`;

-- DropForeignKey
ALTER TABLE `user_prodi` DROP FOREIGN KEY `user_prodi_prodiId_fkey`;

-- DropForeignKey
ALTER TABLE `user_prodi` DROP FOREIGN KEY `user_prodi_userId_fkey`;

-- AlterTable
ALTER TABLE `pengumuman` DROP COLUMN `createdBy`,
    DROP COLUMN `prioritas`;

-- AlterTable
ALTER TABLE `proposal_members` MODIFY `peran` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `proposals` DROP COLUMN `tanggal_deadline`,
    MODIFY `status` ENUM('DRAFT', 'SUBMITTED', 'REVIEW', 'APPROVED', 'REJECTED', 'REVISION', 'COMPLETED') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `reviews` DROP COLUMN `is_final`;

-- AlterTable
ALTER TABLE `skema` DROP COLUMN `luaran_tambahan`,
    MODIFY `tahun_aktif` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `id_sinta`,
    DROP COLUMN `jurusan_mahasiswa`,
    DROP COLUMN `no_rek`,
    ADD COLUMN `jurusan` VARCHAR(191) NULL,
    MODIFY `nip` VARCHAR(191) NULL,
    ALTER COLUMN `role` DROP DEFAULT,
    MODIFY `no_telp` VARCHAR(191) NULL,
    MODIFY `bidang_keahlian` VARCHAR(191) NULL,
    MODIFY `institusi` VARCHAR(191) NULL,
    MODIFY `nim` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `jurusan`;

-- DropTable
DROP TABLE `prodi`;

-- DropTable
DROP TABLE `proposal_documents`;

-- DropTable
DROP TABLE `review_criteria`;

-- DropTable
DROP TABLE `user_jurusan`;

-- DropTable
DROP TABLE `user_prodi`;
