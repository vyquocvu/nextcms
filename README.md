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

## Development

Start the Next.js server:
```bash
npm run dev
```
The app runs at `http://localhost:3000`. The admin dashboard is located at `/dashboard` with **Collections**, **Profile**, and **Settings** sections.

## Project structure

- `cms/prisma/schema.prisma` – Models for `User`, `Role`, `Permission`, `Resource`, `Category`, and `Media`.
- `cms/src/app` – Next.js source code and API routes.


## License

This project is licensed under the MIT license. See [LICENSE](LICENSE) for details.
