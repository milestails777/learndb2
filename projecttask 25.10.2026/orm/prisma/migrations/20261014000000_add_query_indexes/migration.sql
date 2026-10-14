-- DropIndex
DROP INDEX "screenings_movie_id_idx";

-- DropIndex
DROP INDEX "bookings_user_id_idx";

-- CreateIndex
CREATE INDEX "movies_title_idx" ON "movies"("title");

-- CreateIndex
CREATE INDEX "news_post_date_idx" ON "news"("post_date");

-- CreateIndex
CREATE INDEX "screenings_start_time_idx" ON "screenings"("start_time");

-- CreateIndex
CREATE INDEX "screenings_movie_start_time_idx" ON "screenings"("movie_id", "start_time");

-- CreateIndex
CREATE INDEX "bookings_booking_date_idx" ON "bookings"("booking_date");

-- CreateIndex
CREATE INDEX "bookings_user_booking_date_idx" ON "bookings"("user_id", "booking_date");

