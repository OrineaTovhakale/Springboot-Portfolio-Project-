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

## Run tests

```sh
mvn test
```
