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
with permission to access it. Copy `.env.example` to `.env` and set your local
database credentials there. Spring Boot loads `.env` automatically;
`.env` is ignored by Git and must never be committed. The tests use an
in-memory H2 database.

## Frontend

The Angular application is in `frontend/`. Start the Spring Boot API, then run
the frontend in a separate terminal:

```sh
cd frontend
npm install
npm start
```

Angular serves the portfolio at `http://localhost:4200` and proxies `/api`
requests to the backend. Set `FRONTEND_ORIGIN` if the deployed frontend uses a
different origin. See `frontend/README.md` for build and test commands.

## Run tests

```sh
mvn test
```
