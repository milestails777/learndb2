import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

faker.seed(250926);

try {
  console.log("Removing old demo data...");
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.screening.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.news.deleteMany();
  await prisma.user.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.hall.deleteMany();

  const halls = [];
  for (let i = 1; i <= 5; i++) {
    halls.push({
      name: `Hall ${i}`,
      seatsCount: faker.number.int({ min: 80, max: 160 }),
    });
  }
  await prisma.hall.createMany({ data: halls });

  const savedHalls = await prisma.hall.findMany();
  const seats = [];
  for (const hall of savedHalls) {
    for (let number = 1; number <= hall.seatsCount; number++) {
      seats.push({ hallId: hall.hallId, seatNumber: number });
    }
  }
  await prisma.seat.createMany({ data: seats });

  const movies = [];
  for (let i = 0; i < 20; i++) {
    movies.push({
      title: faker.lorem.words({ min: 2, max: 5 }),
      description: faker.lorem.paragraph(),
      durationMinutes: faker.number.int({ min: 80, max: 190 }),
      rating: faker.helpers.arrayElement(["G", "PG", "PG-13", "R"]),
    });
  }
  await prisma.movie.createMany({ data: movies });
  const savedMovies = await prisma.movie.findMany();

  const users = [];
  for (let i = 1; i <= 50; i++) {
    const salt = randomBytes(16);
    const password = scryptSync(faker.internet.password(), salt, 64);

    users.push({
      username: `movie_fan_${i}`,
      email: `movie_fan_${i}@example.com`,
      password: `scrypt:${salt.toString("hex")}:${password.toString("hex")}`,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthDate: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
    });
  }
  await prisma.user.createMany({ data: users });
  const savedUsers = await prisma.user.findMany();

  const news = [];
  for (let i = 0; i < 30; i++) {
    news.push({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(2),
      postDate: faker.date.recent({ days: 90 }),
    });
  }
  await prisma.news.createMany({ data: news });

  const screenings = [];
  for (let i = 0; i < 120; i++) {
    const startTime = faker.date.soon({ days: 30 });
    startTime.setHours(10 + (i % 12), (i % 4) * 15, 0, 0);

    screenings.push({
      movieId: faker.helpers.arrayElement(savedMovies).movieId,
      hallId: savedHalls[i % savedHalls.length].hallId,
      startTime,
      price: faker.number.int({ min: 8, max: 25 }),
    });
  }
  await prisma.screening.createMany({ data: screenings });

  const savedScreenings = await prisma.screening.findMany();
  const savedSeats = await prisma.seat.findMany();
  const bookings = [];
  for (const screening of savedScreenings) {
    const hallSeats = savedSeats.filter((seat) => seat.hallId === screening.hallId);
    const twoSeats = faker.helpers.shuffle(hallSeats).slice(0, 2);

    for (const seat of twoSeats) {
      bookings.push({
        userId: faker.helpers.arrayElement(savedUsers).userId,
        screeningId: screening.screeningId,
        seatId: seat.seatId,
        bookingDate: faker.date.recent({ days: 30 }),
      });
    }
  }
  await prisma.booking.createMany({ data: bookings });

  const reviews = [];
  for (let i = 0; i < 80; i++) {
    reviews.push({
      movieId: faker.helpers.arrayElement(savedMovies).movieId,
      userId: faker.helpers.arrayElement(savedUsers).userId,
      stars: faker.number.int({ min: 1, max: 5 }),
      text: faker.lorem.sentence(),
    });
  }
  await prisma.review.createMany({ data: reviews });

  console.log(`Done: ${savedHalls.length} halls, ${seats.length} seats, ${savedMovies.length} movies.`);
  console.log(`      ${savedUsers.length} users, ${savedScreenings.length} screenings, ${bookings.length} bookings.`);
  console.log(`      ${reviews.length} reviews, ${news.length} news posts.`);
} finally {
  await prisma.$disconnect();
}
