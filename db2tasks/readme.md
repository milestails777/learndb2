# Cinema database

This project uses JavaScript with Prisma ORM and PostgreSQL. Prisma provides typed models and generated migrations, while PostgreSQL runs locally in Docker with a named volume so database data survives container restarts.

## Requirements

- Docker Desktop with Docker Compose
- Node.js 20.19 or newer and npm

## Start the database

From the repository root:

```sh
docker compose up -d --wait db
```

The database is available at `localhost:5432` with database/user/password `cinema` / `student` / `student`. Its data is stored in the `cinema_postgres_data` named volume.

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

`db:migrate` creates/updates the schema using the Prisma models and migrations; no handwritten SQL is used to create the database schema.