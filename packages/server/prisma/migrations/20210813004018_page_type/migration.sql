/*
  Warnings:

  - You are about to drop the column `path` on the `Page` table. All the data in the column will be lost.
  - Added the required column `type` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('HOME_PAGE', 'PRODUCTS_LIST_PAGE', 'SINGLE_PRODUCT_PAGE', 'CART_PAGE');

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "path",
ADD COLUMN     "type" "PageType" NOT NULL;
