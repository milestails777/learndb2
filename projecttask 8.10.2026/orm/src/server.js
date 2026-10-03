import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT ?? 3000);

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));

function parseId(value) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/movies", async (_request, response) => {
  const movies = await prisma.movie.findMany({
    orderBy: { title: "asc" },
    select: {
      movieId: true,
      title: true,
      description: true,
      durationMinutes: true,
      rating: true,
    },
  });

  response.json(movies);
});

app.get("/api/news", async (_request, response) => {
  const news = await prisma.news.findMany({
    orderBy: { postDate: "desc" },
    select: { newsId: true, title: true, content: true, postDate: true },
  });

  response.json(news);
});

app.get("/api/screenings", async (request, response) => {
  const movieId = request.query.movieId === undefined
    ? undefined
    : parseId(request.query.movieId);

  if (request.query.movieId !== undefined && movieId === null) {
    response.status(400).json({ error: "movieId must be a positive integer." });
    return;
  }

  const screenings = await prisma.screening.findMany({
    where: movieId === undefined ? undefined : { movieId },
    orderBy: { startTime: "asc" },
    include: {
      movie: { select: { movieId: true, title: true, durationMinutes: true, rating: true } },
      hall: { select: { hallId: true, name: true, seatsCount: true } },
      _count: { select: { bookings: true } },
    },
  });

  response.json(screenings);
});

app.get("/api/screenings/:screeningId/seats", async (request, response) => {
  const screeningId = parseId(request.params.screeningId);
  if (screeningId === null) {
    response.status(400).json({ error: "screeningId must be a positive integer." });
    return;
  }

  const screening = await prisma.screening.findUnique({
    where: { screeningId },
    select: { screeningId: true, hallId: true },
  });
  if (!screening) {
    response.status(404).json({ error: "Screening not found." });
    return;
  }

  const seats = await prisma.seat.findMany({
    where: { hallId: screening.hallId },
    orderBy: { seatNumber: "asc" },
    select: {
      seatId: true,
      seatNumber: true,
      bookings: {
        where: { screeningId },
        select: { bookingId: true },
        take: 1,
      },
    },
  });

  response.json(seats.map(({ bookings, ...seat }) => ({
    ...seat,
    available: bookings.length === 0,
  })));
});

app.get("/api/bookings", async (request, response) => {
  const userId = request.query.userId === undefined
    ? undefined
    : parseId(request.query.userId);

  if (request.query.userId !== undefined && userId === null) {
    response.status(400).json({ error: "userId must be a positive integer." });
    return;
  }

  const bookings = await prisma.booking.findMany({
    where: userId === undefined ? undefined : { userId },
    orderBy: { bookingDate: "desc" },
    include: {
      screening: {
        select: {
          screeningId: true,
          startTime: true,
          movie: { select: { title: true } },
          hall: { select: { name: true } },
        },
      },
      seat: { select: { seatId: true, seatNumber: true } },
    },
  });

  response.json(bookings);
});

app.post("/api/bookings", async (request, response, next) => {
  const { userId, screeningId, seatId } = request.body ?? {};
  const ids = [userId, screeningId, seatId];
  if (!ids.every((id) => Number.isSafeInteger(id) && id > 0)) {
    response.status(400).json({
      error: "userId, screeningId, and seatId must be positive integers.",
    });
    return;
  }

  try {
    const [user, screening] = await Promise.all([
      prisma.user.findUnique({ where: { userId }, select: { userId: true } }),
      prisma.screening.findUnique({
        where: { screeningId },
        select: { screeningId: true, hallId: true },
      }),
    ]);

    if (!user) {
      response.status(404).json({ error: "User not found." });
      return;
    }
    if (!screening) {
      response.status(404).json({ error: "Screening not found." });
      return;
    }

    const seat = await prisma.seat.findFirst({
      where: { seatId, hallId: screening.hallId },
      select: { seatId: true },
    });
    if (!seat) {
      response.status(400).json({ error: "Seat does not belong to the screening's hall." });
      return;
    }

    const booking = await prisma.booking.create({
      data: { userId, screeningId, seatId, bookingDate: new Date() },
      include: {
        screening: { select: { screeningId: true, startTime: true } },
        seat: { select: { seatId: true, seatNumber: true } },
      },
    });

    response.status(201).json(booking);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      response.status(409).json({ error: "That seat is already booked for this screening." });
      return;
    }

    next(error);
  }
});

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({ error: "Request body must contain valid JSON." });
    return;
  }

  console.error(error);
  response.status(500).json({ error: "Internal server error." });
});

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Cinema API listening on port ${port}.`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
