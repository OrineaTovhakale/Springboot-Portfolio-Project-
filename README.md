# Orinea Tovhakale Portfolio API

Spring Boot backend for the portfolio.

## Requirements

- JDK 21 or newer
- Maven 3.6.3 or newer

## Run locally

```sh
mvn spring-boot:run
```

The application starts on `http://localhost:8080`. Its health endpoint is
available at `http://localhost:8080/actuator/health`.

The public profile API is available at `http://localhost:8080/api/profile` and
returns the portfolio owner's name, title, tagline, and biography as JSON.

The public projects API is available at `http://localhost:8080/api/projects`
and returns the portfolio projects as a JSON array.

Visitors can submit a message with `POST http://localhost:8080/api/contact`.
The JSON body must include a name, valid email address, and a message between
10 and 5,000 characters. Submissions are stored in MySQL.

To run the application, create a MySQL database named `portfolio` and a user
with permission to access it, then set `DB_USERNAME` and `DB_PASSWORD` in your
environment. `DB_URL` is optional and defaults to
`jdbc:mysql://localhost:3306/portfolio`. The tests use an in-memory H2 database.

## Frontend

The React and TypeScript app is in `frontend/`. Start the Spring Boot API first,
then run the frontend in a separate terminal:

```sh
cd frontend
npm install
npm run dev
```

Vite serves the portfolio locally and proxies API requests to the backend.
See `frontend/README.md` for frontend configuration and production builds.

## Run tests

```sh
mvn test
```
