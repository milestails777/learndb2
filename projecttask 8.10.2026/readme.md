# Cinema database

This project uses JavaScript with Express, Prisma ORM, and PostgreSQL. Express provides a small REST API, while Prisma supplies typed database access and migrations; this keeps the backend straightforward to run and the database schema defined in one ORM model. PostgreSQL runs in Docker with a named volume so data survives container restarts.

## Requirements

- Docker Desktop with Docker Compose
- Node.js 20.19 or newer and npm

## Start the backend and database

From this project folder, start the API and database:

```sh
docker compose up -d --build --wait
```

The API is available at `http://localhost:3000`; PostgreSQL is available at `localhost:5432` with database/user/password `cinema` / `student` / `student`. The API container waits for the database and applies Prisma migrations on startup. PostgreSQL data is stored in the `cinema_postgres_data` named volume.

Available API endpoints:

- `GET /health` — API health check
- `GET /api/movies` — list movies
- `GET /api/news` — list news
- `GET /api/screenings` — list screenings; optionally filter with `?movieId=1`
- `GET /api/screenings/:screeningId/seats` — list seats and availability for a screening
- `GET /api/bookings` — list bookings; optionally filter with `?userId=1`
- `POST /api/bookings` — book a seat with JSON such as `{"userId":1,"screeningId":1,"seatId":1}`

Booking requests validate that the user, screening, and seat exist, that the seat belongs to the screening's hall, and that the seat has not already been booked for that screening. This demo API does not implement user authentication.

## Install dependencies and configure Prisma

```sh
cd orm
npm install
Copy-Item .env.example .env
```

On macOS/Linux, use `cp .env.example .env` instead of `Copy-Item`.

## Create tables and load demo data

```sh
npm run db:migrate
npm run db:seed
```

The Faker-powered seed creates halls, seats, movies, news, and users, along with 120 screenings, 240 bookings, and reviews. Every hall has individual seat records, and bookings reference both a screening and an existing seat. Usernames and email addresses are unique, and demo passwords are stored as scrypt hashes.

Useful commands:

```sh
npm run db:generate
npm run db:studio
```

`db:migrate` creates/updates the schema using the Prisma models and migrations; no handwritten SQL is used to create the database schema. To stop the containers while retaining database data, run `docker compose down`; the named volume remains in place.