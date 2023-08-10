/*
  Warnings:

  - You are about to drop the column `clockInOT` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `clockOutOT` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `offday` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `clockInOT`,
    DROP COLUMN `clockOutOT`,
    DROP COLUMN `note`,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `overtimeIn` DATETIME(3) NULL,
    ADD COLUMN `overtineOut` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `offday` DROP COLUMN `description`,
    ADD COLUMN `information` VARCHAR(191) NULL;
