# Task Management

A full-stack task management application with a Node.js + Express backend and a React + Vite frontend.

## Project setup

### Backend
1. Open a terminal and go to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Frontend
1. Open a terminal and go to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Database setup

The backend uses MySQL and includes a Docker Compose file at `backend/docker-compose.yml`.

### Start the database

1. From the `backend` folder, run:
   ```bash
   docker compose up -d
   ```

2. This starts MySQL with the following credentials:
   - Host: `localhost`
   - Port: `3306`
   - Database: `mydb`
   - User: `appuser`
   - Password: `apppassword`
   - Root password: `rootpassword`

3. The container also mounts `backend/docker/init.sql` into the database initialization directory.

> Note: The current Prisma configuration in `backend/configuration/prisma.js` uses hard-coded MySQL connection values.

## Environment variables

The backend loads environment variables from a `.env` file using `dotenv`.

Create a `.env` file in `backend` with values such as:

```env
PORT=3000
```

If you want to move database credentials into environment variables, update `backend/configuration/prisma.js` to use `process.env` values.

## Run the backend

From the `backend` directory:

```bash
npm start
```

This launches the Express server using `nodemon` and listens on `PORT` or `3000` by default.

## Admin login (local test user)

Use the following credentials to sign in as an admin user during local development:

```json
{
  "email": "athul@gmail.com",
  "password": "12345"
}
```

> Only use these credentials for local testing. Do not commit real production secrets.

## Run the frontend

From the `frontend` directory:

```bash
npm run dev
```

Then open the local URL shown by Vite, typically `http://localhost:5173`.

## Typical development workflow

1. Start the database:
   ```bash
   cd backend
   docker compose up -d
   ```
2. Start the backend:
   ```bash
   npm start
   ```
3. Start the frontend:
   ```bash
   cd ../frontend
   npm run dev
   ```

## Notes

- `backend` is the API server.
- `frontend` is the React/Vite client.
- The root `.gitignore` already excludes generated files, node modules, environment files, logs, and editor metadata.
