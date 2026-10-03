-- CreateTable
CREATE TABLE "halls" (
    "hall_id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "seats_count" INTEGER NOT NULL,

    CONSTRAINT "halls_pkey" PRIMARY KEY ("hall_id")
);

-- CreateTable
CREATE TABLE "movies" (
    "movie_id" SERIAL NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "duration_minutes" INTEGER NOT NULL,
    "rating" VARCHAR(10) NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("movie_id")
);

-- CreateTable
CREATE TABLE "news" (
    "news_id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "post_date" DATE NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("news_id")
);

-- CreateTable
CREATE TABLE "screenings" (
    "screening_id" SERIAL NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(0) NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "screenings_pkey" PRIMARY KEY ("screening_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "birth_date" DATE NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "booking_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "screening_id" INTEGER NOT NULL,
    "seat_id" INTEGER NOT NULL,
    "booking_date" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "seats" (
    "seat_id" SERIAL NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "seat_number" INTEGER NOT NULL,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("seat_id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "review_id" SERIAL NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "stars" INTEGER NOT NULL,
    "text" TEXT,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateIndex
CREATE INDEX "screenings_hall_id_idx" ON "screenings"("hall_id");

-- CreateIndex
CREATE INDEX "screenings_movie_id_idx" ON "screenings"("movie_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_screening_seat_key" ON "bookings"("screening_id", "seat_id");

-- CreateIndex
CREATE UNIQUE INDEX "seats_hall_seat_key" ON "seats"("hall_id", "seat_number");

-- CreateIndex
CREATE INDEX "reviews_movie_id_idx" ON "reviews"("movie_id");

-- CreateIndex
CREATE INDEX "reviews_user_id_idx" ON "reviews"("user_id");

-- AddForeignKey
ALTER TABLE "screenings" ADD CONSTRAINT "screenings_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("movie_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screenings" ADD CONSTRAINT "screenings_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("hall_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_screening_id_fkey" FOREIGN KEY ("screening_id") REFERENCES "screenings"("screening_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("seat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("hall_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("movie_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
