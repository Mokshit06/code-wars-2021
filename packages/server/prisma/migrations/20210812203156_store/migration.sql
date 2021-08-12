/*
  Warnings:

  - You are about to drop the column `subdomain` on the `Store` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[domain]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apartment` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domain` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pinCode` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Store" DROP COLUMN "subdomain",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "apartment" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "domain" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "pinCode" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "website" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Store.name_unique" ON "Store"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Store.domain_unique" ON "Store"("domain");
