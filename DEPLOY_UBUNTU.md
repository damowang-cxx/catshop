# Ubuntu Production Template (Nginx + HTTPS + systemd)

This is a minimal production template for:

- `catshop` (Next.js web + BFF) on `127.0.0.1:3000`
- `catshop-api` (NestJS API) on `127.0.0.1:3001`
- Nginx reverse proxy on `elowynn.com` with TLS

## 1) Directory assumptions

This guide assumes:

- web repo: `/home/ubuntu/project/shop/catshop`
- api repo: `/home/ubuntu/project/shop/catshop-api`
- domain: `elowynn.com`

Adjust paths in service files if your actual location differs.

## 2) Install runtime dependencies

```bash
sudo apt update
sudo apt install -y nginx
```

Install Node.js 22 and pnpm (example):

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo corepack enable
sudo corepack prepare pnpm@latest --activate
```

## 3) Prepare TLS certificates

You already have:

- `elowynn.com.csr` (not used at runtime)
- `elowynn.com.key`
- `elowynn.com_bundle.crt`
- `elowynn.com_bundle.pem`

Place certificate files:

```bash
sudo mkdir -p /etc/nginx/ssl/elowynn.com
sudo cp elowynn.com.key /etc/nginx/ssl/elowynn.com/
sudo cp elowynn.com_bundle.crt /etc/nginx/ssl/elowynn.com/
# optional:
# sudo cp elowynn.com_bundle.pem /etc/nginx/ssl/elowynn.com/
sudo chmod 600 /etc/nginx/ssl/elowynn.com/elowynn.com.key
sudo chmod 644 /etc/nginx/ssl/elowynn.com/elowynn.com_bundle.crt
```

## 4) Start infra containers (api dependencies)

In `catshop-api`:

```bash
cd /home/ubuntu/project/shop/catshop-api
cp .env.compose.example .env.compose
sudo docker compose --env-file .env.compose up -d postgres redis minio clickhouse meilisearch mailpit
```

Why `--env-file .env.compose`:

- avoid Compose parsing application `.env` values with `$` (Argon2 hashes)
- prevents false "variable is not set" warnings

## 5) Build applications

API:

```bash
cd /home/ubuntu/project/shop/catshop-api
pnpm install --frozen-lockfile
pnpm prisma:generate
pnpm exec prisma migrate deploy
pnpm build
```

Web:

```bash
cd /home/ubuntu/project/shop/catshop
pnpm install --frozen-lockfile
pnpm build
```

## 6) Create runtime env files for systemd

```bash
sudo mkdir -p /etc/catshop
sudo cp /home/ubuntu/project/shop/catshop/deploy/systemd/catshop-api.env.example /etc/catshop/catshop-api.env
sudo cp /home/ubuntu/project/shop/catshop/deploy/systemd/catshop-web.env.example /etc/catshop/catshop-web.env
sudo chmod 600 /etc/catshop/catshop-api.env /etc/catshop/catshop-web.env
```

Edit both files and replace placeholders, especially:

- `COOKIE_SECRET`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `ADMIN_PASSWORD_HASH`
- `CUSTOMER_PASSWORD_HASH`

## 7) Install systemd services

```bash
sudo cp /home/ubuntu/project/shop/catshop/deploy/systemd/catshop-api.service /etc/systemd/system/
sudo cp /home/ubuntu/project/shop/catshop/deploy/systemd/catshop-web.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now catshop-api catshop-web
sudo systemctl status catshop-api catshop-web
```

Check logs:

```bash
sudo journalctl -u catshop-api -f
sudo journalctl -u catshop-web -f
```

## 8) Install Nginx reverse proxy

```bash
sudo cp /home/ubuntu/project/shop/catshop/deploy/nginx/elowynn.com.conf /etc/nginx/sites-available/elowynn.com.conf
sudo ln -sf /etc/nginx/sites-available/elowynn.com.conf /etc/nginx/sites-enabled/elowynn.com.conf
sudo nginx -t
sudo systemctl reload nginx
```

## 9) Firewall recommendation

Only expose `80/443` publicly.
Keep `3000/3001/5432/6379/7700/8123/9000/9001` internal.

## 10) Critical architecture note

Do **not** proxy `/api` directly to `catshop-api`.

Current project uses BFF routes in Next.js (`catshop/app/api/*`) for auth/cookie flow.
Nginx must proxy external traffic to Next.js at `127.0.0.1:3000`.

## 11) Ubuntu deployment-difference audit for this project

Known differences to account for in future development:

1. Compose + `$` expansion:
   - Any new secret/hash containing `$` must not be consumed by Compose `.env`.
   - Keep a dedicated Compose env file (`.env.compose`).

2. Production cookies require HTTPS:
   - Auth cookies are `secure` when `NODE_ENV=production`.
   - HTTP-only validation on server IP will fail to persist login cookies.

3. Keep BFF boundary stable:
   - Browser should hit `https://elowynn.com/api/*` (Next BFF), not backend `:3001`.
   - New frontend features should continue using Next route handlers for sensitive APIs.

4. Cross-platform scripts:
   - Avoid Windows-specific commands in docs/scripts.
   - Prefer POSIX-compatible commands for deployment docs.
