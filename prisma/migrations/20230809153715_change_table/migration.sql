/*
  Warnings:

  - You are about to drop the column `overtineOut` on the `attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `overtineOut`,
    ADD COLUMN `overtimeOut` DATETIME(3) NULL;
