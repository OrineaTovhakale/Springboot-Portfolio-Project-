# Portfolio frontend

React, TypeScript, and Vite frontend for the portfolio. It reads profile and
project content from the Spring Boot API and submits contact messages to it.

## Run locally

1. Start the backend on `http://localhost:8080`.
2. From this directory, install dependencies and start Vite:

   ```sh
   npm install
   npm run dev
   ```

Vite proxies `/api` requests to the backend. Set `VITE_API_BASE_URL` when the
frontend and API are deployed on different origins. Configure the backend's
`FRONTEND_ORIGIN` to match the deployed frontend origin.

## Check

```sh
npm run build
npm run lint
```
