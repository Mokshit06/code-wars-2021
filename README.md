# Dukaan

The best e-commerce platform to start your business online

## Requirements

- postgres
- nodejs
- yarn

## Setup

1. Install the dependencies.

```bash
yarn install
```

2. Copy `.env.example` files to `.env`.

```bash
cp packages/web/.env.example packages/web/.env
cp packages/server/.env.example packages/server/.env
```

3. Get Google OAuth credentials, add the client id and client secret, the postgres connection url and cookie secret (random string) in `packages/server.env`.

```bash
GOOGLE_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
COOKIE_SECRET="..."
DATABASE_URL="postgresql://user:password@localhost:5432/code-wars-2021?schema=public"
```

4. Create database and run migrations.

```bash
cd packages/server && yarn prisma migrate dev && cd ..
```

5. Add api url to `packages/web/.env`.

```bash
# if running locally, lvh.me proxies to localhost
# use lvh.me instead of localhost because localhost
# doesn't support subdomains
NEXT_PUBLIC_API_URL="http://api.lvh.me:5000"
```

6. Start server and web app.

```bash
yarn dev
```

7. The web app should be running on `http://lvh.me:3000`, along with the server running on `http://api.lvh.me:5000`.
