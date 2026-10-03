# Cinema

Open PowerShell in this folder and run:

```powershell
docker compose up -d --build --wait
docker compose exec api npm run db:seed
```

Open http://localhost:3000/api/movies to see the movies.

To stop:

```powershell
docker compose down
```
