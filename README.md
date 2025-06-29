# NextCMS

NextCMS is a simple content management system (CMS) built with **Next.js** and **Prisma**. It mirrors basic Strapi features so you can learn how to build a CMS using the Next.js App Router and Prisma-backed database.

## Setup

1. Copy the example environment file and update the values:
   ```bash
   cp .env.example .env
   # Choose sqlite, mysql, or postgresql
   # DB_TYPE=sqlite
   # DATABASE_URL="file:./dev.db"
   ```
2. Install dependencies in the `cms` directory and create its env file:
   ```bash
   cd cms
   npm install
   cp .env.example .env
   ```
3. Generate the Prisma client and initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

   **Note:** Running tests requires the Prisma client. If it hasn't been generated yet, run `npx prisma generate` (this downloads the Prisma engines the first time).

### Migrating from JSON storage

Earlier versions stored content in flat JSON files. After updating to the Prisma models you should regenerate the client and push the schema:

```bash
npx prisma generate
npx prisma db push
```

Move any existing JSON data into the new database tables as needed.

## Development

Start the Next.js server:
```bash
npm run dev
```
The app runs at `http://localhost:3000`. The admin dashboard is located at `/dashboard` with **Collections**, **Profile**, and **Settings** sections.

## Project structure

- `cms/prisma/schema.prisma` – Models for `User`, `Role`, `Permission`, `Resource`, `Category`, `Media`, and dynamic content types.
- `cms/src/app` – Next.js source code and API routes.

## Authentication

The CMS uses **NextAuth** with a Prisma adapter for user sessions. To configure i
t:

1. Install dependencies in the `cms` directory:
   ```bash
   npm install next-auth @next-auth/prisma-adapter
   ```
2. Set environment variables in `cms/.env`:
   ```bash
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```
3. Generate the Prisma client and push the schema so the NextAuth tables are cre
ated:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Testing

Before running tests, generate the Prisma client:

```bash
npx prisma generate
```

Set `DB_TYPE` and `DATABASE_URL` in your environment (see `.env.example`).

Run unit tests:

```bash
npm run test:unit
```

Run integration tests:

```bash
npm run test:integration
```

Run end-to-end tests:

```bash
npm run test:e2e
```

## License

This project is licensed under the MIT license. See [LICENSE](LICENSE) for details.
