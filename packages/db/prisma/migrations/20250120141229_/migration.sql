/*
  Warnings:

  - You are about to drop the column `seats` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `adminId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingId` to the `Seat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qr` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "seats";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "adminId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Seat" ADD COLUMN     "bookingId" TEXT NOT NULL,
ADD COLUMN     "qr" TEXT NOT NULL;
