# google-cloud-yotpo

API proxy between the Murad website frontend and Yotpo Loyalty APIs, deployed on Google Cloud Run. The browser never sees Yotpo credentials — it sends a `customer_email`, this service calls Yotpo server-side, and returns only the fields the frontend needs.

## Endpoints

### `POST /api/customers/points-expiration`

Request headers:
- `Content-Type: application/json`
- `x-api-key: <PROXY_API_KEY>`

Request body:
```json
{ "customer_email": "jane@example.com" }
```

Response:
```json
{
  "apiVersion": "1.0.0",
  "message": "OK",
  "data": {
    "next_points_expire_on": "2026-08-01",
    "next_points_expire_amount": 150
  }
}
```

Status codes: `400` missing/invalid `customer_email`, `403` missing/invalid `x-api-key`, `404` no matching Yotpo customer, `502` Yotpo API failure, `500` unexpected error.

## Local development

1. `npm install`
2. Copy `.env.example` to `.env` and fill in real values (`.env` is gitignored — never commit real credentials):
   - `YOTPO_GUID` / `YOTPO_API_KEY` — from the Yotpo Loyalty dashboard under Settings > General Settings
   - `PROXY_API_KEY` — any shared secret string; the browser must send this back as `x-api-key`
   - `ALLOWED_ORIGINS` — comma-separated list of origins allowed to call this API (e.g. `http://localhost:3000` for local frontend testing)
3. `npm start` — runs `functions-framework --target=yotpoProxy`, listening on port 8080 by default
4. Test:
   ```bash
   curl -X POST http://localhost:8080/api/customers/points-expiration \
     -H "Content-Type: application/json" \
     -H "x-api-key: <PROXY_API_KEY>" \
     -d '{"customer_email":"jane@example.com"}'
   ```

## Docker

```bash
docker build -t yotpo-proxy .
docker run -p 8080:8080 --env-file .env yotpo-proxy
```

## Deploying to Google Cloud Run

1. In the Cloud Run console, create a new service and choose "Continuously deploy from a repository", pointing at this GitHub repo/branch, with a Docker-based build (uses the `Dockerfile` in this repo).
2. Under the service's "Variables & Secrets" tab:
   - Store `YOTPO_API_KEY` and `PROXY_API_KEY` as **Secret Manager secrets** (create the secrets in Secret Manager first, then reference them here) rather than plaintext variables, since these are sensitive credentials.
   - Set `YOTPO_GUID`, `YOTPO_API_BASE_URL`, and `ALLOWED_ORIGINS` as plain environment variables.
3. Since requests originate from a public browser (not a trusted Google service), leave the service set to "Allow unauthenticated invocations" — access control is instead enforced by the `x-api-key` shared-secret header plus CORS origin restriction.
4. Cloud Run automatically sets the `PORT` environment variable; `functions-framework` binds to it without any extra configuration.
