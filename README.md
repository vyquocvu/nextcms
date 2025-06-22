# NextCMS

NextCMS is a simple content management system (CMS) built with **Next.js** and **Prisma**. It mirrors basic Strapi features so you can learn how to build a CMS using the Next.js App Router and Prisma-backed database.

## Setup

1. Install dependencies in the `cms` directory:
   ```bash
   cd cms
   npm install
   ```
2. Create a `.env` file in `cms` and specify the database connection:
   ```bash
   # Choose sqlite, mysql, or postgresql
   DB_TYPE=sqlite
   DATABASE_URL="file:./dev.db"
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
The app runs at `http://localhost:3000`. The admin dashboard is located at `/admin` with **Posts**, **Profile**, and **Settings** sections.

## Project structure

- `cms/prisma/schema.prisma` – Models for `User`, `Role`, `Permission`, `Resource`, `Post`, `Category`, and `Media`.
- `cms/src/app` – Next.js source code and API routes.
- `cms/data/posts.json` – Sample post data.

A simple posts API is available at `/api/posts` for creating and fetching posts.

## License

This project is licensed under the MIT license. See [LICENSE](LICENSE) for details.
