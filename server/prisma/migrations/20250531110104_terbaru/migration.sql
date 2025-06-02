/*
  Warnings:

  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(6))` to `Enum(EnumId(0))`.
  - You are about to alter the column `no_telp` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `no_rek` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `id_sinta` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - A unique constraint covering the columns `[nim]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `bidang_keahlian` VARCHAR(255) NULL,
    ADD COLUMN `institusi` VARCHAR(100) NULL,
    ADD COLUMN `jurusan_mahasiswa` VARCHAR(100) NULL,
    ADD COLUMN `nim` VARCHAR(50) NULL,
    MODIFY `role` ENUM('ADMIN', 'DOSEN', 'MAHASISWA', 'REVIEWER') NOT NULL DEFAULT 'MAHASISWA',
    MODIFY `no_telp` VARCHAR(50) NULL,
    MODIFY `no_rek` VARCHAR(100) NULL,
    MODIFY `id_sinta` VARCHAR(100) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_nim_key` ON `users`(`nim`);
