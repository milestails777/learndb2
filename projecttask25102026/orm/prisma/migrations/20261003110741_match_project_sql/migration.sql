-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_screening_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_seat_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "screenings" DROP CONSTRAINT "screenings_hall_id_fkey";

-- DropForeignKey
ALTER TABLE "screenings" DROP CONSTRAINT "screenings_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "seats" DROP CONSTRAINT "seats_hall_id_fkey";

-- AddForeignKey
ALTER TABLE "screenings" ADD CONSTRAINT "screenings_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("movie_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "screenings" ADD CONSTRAINT "screenings_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("hall_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_screening_id_fkey" FOREIGN KEY ("screening_id") REFERENCES "screenings"("screening_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("seat_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("hall_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("movie_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
