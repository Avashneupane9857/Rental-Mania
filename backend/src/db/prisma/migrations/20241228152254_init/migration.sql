/*
  Warnings:

  - The values [VILLA,HOME,CABIN,FARMS,CAMP] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('Villa', 'Home', 'Cabin', 'Farms', 'Camp', 'Beach', 'Bungalow', 'Treehouse', 'Penthouse', 'Castle', 'Mansion');
ALTER TABLE "Listing" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
COMMIT;
