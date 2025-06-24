# NextCMS App

This directory contains the Next.js application for NextCMS.

## Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and adjust the values:

   ```bash
   cp .env.example .env
   # DB_TYPE=sqlite
   # DATABASE_URL="file:./dev.db"
   ```

3. Generate the Prisma client and set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

Visit <http://localhost:3000> to view the app.
