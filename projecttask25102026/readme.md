# Cinema

## Run

In this folder, run:

```powershell
docker compose up -d --build --wait
docker compose exec api npm run db:seed
```

to see movie sessions run this commands:
'''For movies
$movie = (Invoke-RestMethod "http://localhost:3000/api/movies")[0]
Invoke-RestMethod "http://localhost:3000/api/screenings?movieId=$($movie.movieId)" |
    ConvertTo-Json -Depth 5
'''

'''For sessions
$screening = (Invoke-RestMethod "http://localhost:3000/api/screenings")[0]
Invoke-RestMethod "http://localhost:3000/api/screenings/$($screening.screeningId)/seats" |
    ConvertTo-Json -Depth 5
'''
You can see those created index by typing this command:
docker compose exec db psql -U student -d cinema -c "SELECT tablename, indexname, indexdef FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;"

Open http://localhost:3000/api/movies. Stop with `docker compose down`.

## Indexes

- `movies.title` — sorts movies by title.
- `news.post_date` — sorts news by date.
- `screenings.start_time` — sorts screenings by time.
- `screenings(movie_id, start_time)` — filters screenings by movie and sorts by time.
- `screenings.hall_id` — filters seats by the hall for a screening.
- `bookings.booking_date` — sorts all bookings by date.
- `bookings(user_id, booking_date)` — filters a user's bookings and sorts by date.
- `reviews.movie_id` — supports looking up reviews for a movie; there is no reviews API endpoint yet.
- `reviews.user_id` — supports looking up reviews by user; there is no reviews API endpoint yet.

These indexes match API queries where available; the review indexes support lookups if a reviews endpoint is added. Primary keys and unique fields are indexed too. There are no movie genre or release-date fields in this project.

## Caching plan

Redis is not set up yet. If added:

- Movies: cache for 5 minutes, clear when a movie changes.
- News: cache for 1 minute, clear when a news post changes.
- Screenings: cache for 30 seconds, clear when a screening changes or a ticket is booked.
- Seat availability: cache for 10 seconds, clear when a ticket is booked or cancelled.
- Bookings. do not use a shared cache because results may belong to a specific user.
