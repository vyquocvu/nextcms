# NextCMS

NextCMS is a simple content management system (CMS) built with **Next.js** and **Prisma**. It mirrors basic Strapi features so you can learn how to build a CMS using the Next.js App Router and Prisma-backed database.

## Setup

1. Install dependencies in the `cms` directory:
   ```bash
   cd cms
   npm install
   ```
2. Copy the provided example env file and update it:
   ```bash
   cp .env.example .env
   # Choose sqlite, mysql, or postgresql
   # DB_TYPE=sqlite
   # DATABASE_URL="file:./dev.db"
   ```
3. Generate the Prisma client and initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

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
