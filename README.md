# Meal Mate

Meal Mate is a meal-planning app with a web interface, an API, and a MySQL database.

## What you need

- Node.js 24 or newer and npm 11 or newer
- Docker Desktop running (it provides the MySQL database)
- The Meal Mate project ZIP, extracted to a folder

Open a terminal in the extracted project folder and install dependencies:

```sh
npm ci
```

Copy the provided environment examples to the files the apps load. The API example contains the local database settings, JWT secret, and administrator login credentials; the UI example points to the API.

macOS/Linux/Git Bash:

```sh
cp apps/api/.env.example apps/api/.env
cp apps/ui/.env.example apps/ui/.env
```

PowerShell:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/ui/.env.example apps/ui/.env
```

Build the shared schemas package before starting the services:

```sh
npm run build -w @meal-mate/schemas
```

## Start Meal Mate

Start the parts in this order: **database → API → UI**. Keep each running service open in its own terminal.

### 1. Database

From the api folder, start MySQL:

```sh
cd apps
cd api
docker compose up --build -d
```

### 2. API and administrator account

Create the administrator account using the email and password provided in `apps/api/.env.example`. These credentials are for logging into Meal Mate. Run the seed script once:

```sh
npm run seed:admin -w api
```

Build and start the API:

```sh
npm run start:dev -w api
```

The API runs at [http://localhost:3000](http://localhost:3000).

### 3. UI

In another terminal, build and start the web app:

```sh
npm run build -w ui
npm run start -w ui
```

Open the local URL printed by Next.js (normally [http://localhost:3001](http://localhost:3001)) and sign in with the administrator email and password from the API environment example.

## Stop Meal Mate

Stop the API and UI with `Ctrl+C` in their terminals. Stop MySQL from the project folder:

```sh
docker compose --env-file apps/api/.env -f apps/api/compose.yaml down
```
