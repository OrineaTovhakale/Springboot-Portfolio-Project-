# Portfolio frontend

The portfolio frontend is built with Angular and TypeScript. It reads profile
and project content from the Spring Boot API and submits contact messages to it.
Angular CLI is configured to build and serve the app with Webpack.

## Run locally

1. Start the Spring Boot API at `http://localhost:8080`.
2. From this directory, install dependencies and start Angular:

   ```sh
   npm install
   npm start
   ```

Open `http://localhost:4200`. The Angular development server proxies `/api`
requests to the backend using `proxy.conf.json`.

## Build and test

```sh
npm run build
npm test -- --watch=false
```
