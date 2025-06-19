# nextcms
A Next.js CMS combines the flexibility of React with the performance and SEO advantages of server-side rendering and static generation. When deployed on Vercel, it takes full advantage of Vercel’s global edge network, auto-scaling, and CI/CD workflows.

## Getting Started

The Next.js project is located in the `cms` directory. To start the development server:

```bash
cd cms
npm run dev
```

This will launch the app at `http://localhost:3000`.

## Dashboard Example

A simple dashboard layout with sidebar navigation is available at `/dashboard` after starting the development server.

### Posts API

The example includes a minimal content management system with an API for creating and listing posts. You can interact with it from the **Posts** section in the dashboard sidebar.

### Prisma Schema

The `cms/prisma/schema.prisma` file defines database models for a basic CMS. It covers `User`, `Role`, `Permission`, `Post`, `Category` and `Media` similar to Strapi.
Run the following commands after installing dependencies to generate the Prisma client:

```bash
cd cms
npx prisma generate
```
