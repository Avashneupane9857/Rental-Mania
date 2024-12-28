/*
  Warnings:

  - Added the required column `locationName` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyName` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "locationName" TEXT NOT NULL,
ADD COLUMN     "propertyName" TEXT NOT NULL;
