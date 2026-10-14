import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.json());

function getId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/movies", async (_request, response) => {
  const movies = await prisma.movie.findMany({
    orderBy: { title: "asc" },
  });
  response.json(movies);
});

app.get("/api/news", async (_request, response) => {
  const news = await prisma.news.findMany({
    orderBy: { postDate: "desc" },
  });
  response.json(news);
});

app.get("/api/screenings", async (request, response) => {
  let movieId;

  if (request.query.movieId !== undefined) {
    movieId = getId(request.query.movieId);
    if (!movieId) {
      return response.status(400).json({ error: "movieId must be a positive number." });
    }
  }

  const screenings = await prisma.screening.findMany({
    where: movieId ? { movieId } : {},
    orderBy: { startTime: "asc" },
    include: {
      movie: true,
      hall: true,
      _count: { select: { bookings: true } },
    },
  });
  response.json(screenings);
});

app.get("/api/screenings/:id/seats", async (request, response) => {
  const screeningId = getId(request.params.id);
  if (!screeningId) {
    return response.status(400).json({ error: "Screening ID must be a positive number." });
  }

  const screening = await prisma.screening.findUnique({
    where: { screeningId },
  });
  if (!screening) {
    return response.status(404).json({ error: "Screening not found." });
  }

  const seats = await prisma.seat.findMany({
    where: { hallId: screening.hallId },
    orderBy: { seatNumber: "asc" },
    include: {
      bookings: {
        where: { screeningId },
        select: { bookingId: true },
      },
    },
  });

  response.json(seats.map((seat) => ({
    seatId: seat.seatId,
    seatNumber: seat.seatNumber,
    available: seat.bookings.length === 0,
  })));
});

app.get("/api/bookings", async (request, response) => {
  let userId;

  if (request.query.userId !== undefined) {
    userId = getId(request.query.userId);
    if (!userId) {
      return response.status(400).json({ error: "userId must be a positive number." });
    }
  }

  const bookings = await prisma.booking.findMany({
    where: userId ? { userId } : {},
    orderBy: { bookingDate: "desc" },
    include: {
      screening: { include: { movie: true, hall: true } },
      seat: true,
    },
  });
  response.json(bookings);
});

app.post("/api/bookings", async (request, response, next) => {
  const { userId, screeningId, seatId } = request.body || {};

  if (![userId, screeningId, seatId].every((id) => Number.isInteger(id) && id > 0)) {
    return response.status(400).json({
      error: "Send positive userId, screeningId, and seatId numbers.",
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
      return response.status(404).json({ error: "User not found." });
    }

    const screening = await prisma.screening.findUnique({ where: { screeningId } });
    if (!screening) {
      return response.status(404).json({ error: "Screening not found." });
    }

    const seat = await prisma.seat.findFirst({
      where: { seatId, hallId: screening.hallId },
    });
    if (!seat) {
      return response.status(400).json({ error: "Seat is not in this screening's hall." });
    }

    const booking = await prisma.booking.create({
      data: { userId, screeningId, seatId, bookingDate: new Date() },
    });
    response.status(201).json(booking);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return response.status(409).json({ error: "This seat is already booked." });
    }
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return response.status(400).json({ error: "Request body must be valid JSON." });
  }

  console.error(error);
  response.status(500).json({ error: "Server error." });
});

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Cinema API is running on port ${port}.`);
});

process.on("SIGTERM", () => {
  server.close(() => prisma.$disconnect());
});
