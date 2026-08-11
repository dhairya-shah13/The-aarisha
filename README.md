# Aarisha

Luxury accessories storefront with a vanilla-JS marketing site and a FastAPI/Supabase catalogue API.

## Run the API

1. Create a Supabase project and run `supabase-schema.sql` in its SQL editor.
2. Copy `backend/.env.example` to `backend/.env`, set every value, and keep the service-role key server-side.
3. Install and run:

   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

4. Serve the `frontend/` folder with a static server (e.g. `cd frontend && python -m http.server 5500`). The frontend uses `http://127.0.0.1:8000` locally.

## Deploy to Vercel

The repository includes a same-domain FastAPI function at `/api`, and the static frontend lives in `frontend/` (served at the site root via `vercel.json` rewrites). Add the values from `backend/.env` as Vercel Production environment variables (do not upload the `.env` file), then redeploy. The deployed storefront and admin page automatically use `/api`; local development continues to use `http://127.0.0.1:8000`.

API documentation is available at `/docs` while the server is running.

To create the admin hash after installing dependencies, run `python generate_password_hash.py` from `backend/`, then paste the output into `ADMIN_PASSWORD_HASH` in `backend/.env`. The script uses a hidden prompt, so the password does not enter shell history.

## API routes

- `POST /auth/register` and `POST /auth/login` create/login regular users.
- `POST /admin/login` issues an admin JWT from server-only credentials.
- `GET /products` and `GET /products/{category}` are public catalogue routes.
- `POST /orders/whatsapp-link` creates a WhatsApp draft from current server-side product prices; it does not record an order.
- `POST /admin/products`, `PATCH /admin/products/{id}`, and `DELETE /admin/products/{id}` require an admin bearer token.

Open `frontend/admin.html` through the same static server to use the minimal product-management UI. Its API base URL is the same local default as the storefront and can be changed before deployment.

## Security

Passwords are bcrypt **hashes**, never encrypted or stored in plaintext. `ADMIN_PASSWORD_HASH`, `JWT_SECRET`, the Supabase service-role key, and `BRAND_WHATSAPP_NUMBER` belong only in backend environment variables. Do not expose them in browser code, commits, or static-host configuration. The browser receives a WhatsApp deep link only after asking the API to generate one; the phone number is not present in the page source, though it remains visible in the eventual `wa.me` destination by design.

The login limiter is in-memory and suitable only for a single process. Use a shared store or gateway rate limiter for production scaling. Google Drive links are normalized to Drive thumbnail URLs for convenience; Drive can throttle hotlinked images, so migrate to managed object storage if traffic grows.
