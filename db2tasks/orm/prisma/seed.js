import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

faker.seed(250926);

try {
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.screening.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.news.deleteMany();
  await prisma.user.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.hall.deleteMany();

  await prisma.hall.createMany({
    data: Array.from({ length: 5 }, (_, index) => ({
      name: `Hall ${index + 1}`,
      seatsCount: faker.number.int({ min: 80, max: 160 }),
    })),
  });
  const halls = await prisma.hall.findMany();
  const seatData = halls.flatMap((hall) =>
    Array.from({ length: hall.seatsCount }, (_, index) => ({
      hallId: hall.hallId,
      seatNumber: index + 1,
    })),
  );
  await prisma.seat.createMany({ data: seatData });

  await prisma.movie.createMany({
    data: Array.from({ length: 20 }, () => ({
      title: faker.lorem.words({ min: 2, max: 5 }),
      description: faker.lorem.paragraph(),
      durationMinutes: faker.number.int({ min: 80, max: 190 }),
      rating: faker.helpers.arrayElement(["G", "PG", "PG-13", "R"]),
    })),
  });
  await prisma.news.createMany({
    data: Array.from({ length: 30 }, () => ({
      title: faker.lorem.sentence({ min: 4, max: 8 }),
      content: faker.lorem.paragraphs({ min: 2, max: 4 }),
      postDate: faker.date.recent({ days: 90 }),
    })),
  });
  await prisma.user.createMany({
    data: Array.from({ length: 50 }, (_, index) => {
      const salt = randomBytes(16);
      const passwordHash = scryptSync(faker.internet.password({ length: 32 }), salt, 64);
      const [emailName, emailDomain] = faker.internet.email().split("@");
      const suffix = String(index);
      const localPartLength = 99 - emailDomain.length - suffix.length - 1;
      const email = `${emailName.slice(0, localPartLength)}+${suffix}@${emailDomain}`;

      return {
        username: `${faker.internet.username().slice(0, 38)}_${index}`,
        email,
        password: `scrypt:${salt.toString("hex")}:${passwordHash.toString("hex")}`,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        birthDate: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
      };
    }),
  });

  const [movies, users] = await Promise.all([
    prisma.movie.findMany(),
    prisma.user.findMany(),
  ]);

  await prisma.screening.createMany({
    data: Array.from({ length: 120 }, (_, index) => {
      const startTime = faker.date.soon({ days: 30 });
      startTime.setHours(10 + (index % 12), [0, 15, 30, 45][index % 4], 0, 0);

      return {
        movieId: faker.helpers.arrayElement(movies).movieId,
        hallId: halls[index % halls.length].hallId,
        startTime,
        price: faker.number.int({ min: 8, max: 25 }),
      };
    }),
  });

  const screenings = await prisma.screening.findMany();
  const seats = await prisma.seat.findMany();
  const seatsByHall = new Map(halls.map((hall) => [
    hall.hallId,
    seats.filter((seat) => seat.hallId === hall.hallId),
  ]));
  const bookings = [];
  for (const screening of screenings) {
    const bookedSeats = faker.helpers.shuffle(seatsByHall.get(screening.hallId)).slice(0, 2);
    for (const seat of bookedSeats) {
      bookings.push({
        userId: faker.helpers.arrayElement(users).userId,
        screeningId: screening.screeningId,
        seatId: seat.seatId,
        bookingDate: faker.date.recent({ days: 30 }),
      });
    }
  }
  await prisma.booking.createMany({ data: bookings });

  await prisma.review.createMany({
    data: Array.from({ length: 80 }, () => ({
      movieId: faker.helpers.arrayElement(movies).movieId,
      userId: faker.helpers.arrayElement(users).userId,
      stars: faker.number.int({ min: 1, max: 5 }),
      text: faker.lorem.sentence(),
    })),
  });

  console.log(
    `Seeded ${halls.length} halls, ${seatData.length} seats, ${movies.length} movies, ${users.length} users, ${screenings.length} screenings, ${bookings.length} bookings, 80 reviews, and 30 news items.`,
  );
} finally {
  await prisma.$disconnect();
}