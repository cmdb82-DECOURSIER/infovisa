# 🌍 Visa Comparator

A production-ready web app to compare visa requirements for 195+ countries — built with Next.js 15, Prisma, PostgreSQL, and TailwindCSS.

## Features

- **Instant Comparator** — search visa requirements by nationality + destination + visa type
- **195 Country Pages** — dynamic SEO-optimized destination pages
- **Real-time Data** — Prisma ORM with PostgreSQL, weekly scraper updates
- **Blog** — markdown-powered articles with reading time and social sharing
- **Email Alerts** — subscribe to policy change notifications via SendGrid
- **8 API Endpoints** — public REST API with Zod validation
- **Fully Responsive** — mobile-first design with Tailwind

## Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Framework   | Next.js 15 (App Router)       |
| Language    | TypeScript (strict)           |
| Styling     | TailwindCSS + custom theme    |
| Database    | PostgreSQL + Prisma ORM       |
| Email       | SendGrid                      |
| Deployment  | Vercel                        |
| CI/CD       | GitHub Actions                |

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-username/visa-comparator.git
cd visa-comparator
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env.local
# Edit .env.local — add your DATABASE_URL at minimum
```

### 3. Setup Database

```bash
# Run migrations
npx prisma migrate dev --name init

# Seed with 50 countries + sample visa data
npm run db:seed
```

### 4. Run Dev Server

```bash
npm run dev
# Open http://localhost:3000
```

## Project Structure

```
visa-comparator/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── compare/            # Comparator tool
│   ├── destination/[c]/    # Country destination pages
│   ├── blog/               # Blog listing + posts
│   └── api/                # REST API endpoints
├── components/             # React components
│   ├── ui/                 # Reusable UI library
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CountrySelect.tsx
│   ├── VisaComparisonTable.tsx
│   ├── VisaDetailsModal.tsx
│   └── ...
├── lib/                    # Utilities
│   ├── db.ts               # Prisma client
│   ├── blog.ts             # Blog utilities
│   ├── validation.ts       # Zod schemas
│   └── api-utils.ts        # API helpers
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
└── content/
    └── blog/               # Markdown blog posts
```

## API Reference

| Endpoint                              | Description                         |
|---------------------------------------|-------------------------------------|
| `GET /api/visas?from=US&to=FR`        | Get visa requirements               |
| `GET /api/visas/:id`                  | Get single visa requirement         |
| `GET /api/countries`                  | List all countries                  |
| `GET /api/countries/:code`            | Get country details + stats         |
| `GET /api/passports/:nationality`     | Get passport power stats            |
| `GET /api/search?q=france`            | Search countries                    |
| `POST /api/alerts/subscribe`          | Subscribe to alerts                 |
| `GET /api/alerts/confirm?token=xxx`   | Confirm email subscription          |

## Available Scripts

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run lint          # ESLint
npm run type-check    # TypeScript check
npm run db:setup      # Run migrations
npm run db:seed       # Seed initial data
npm run db:studio     # Open Prisma Studio
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repo at vercel.com/new
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables

| Variable                    | Required | Description                    |
|-----------------------------|----------|--------------------------------|
| `DATABASE_URL`              | ✅       | PostgreSQL connection string   |
| `SENDGRID_API_KEY`          | Optional | For email alerts               |
| `SENDGRID_FROM_EMAIL`       | Optional | Sender email address           |
| `NEXT_PUBLIC_APP_URL`       | Optional | Your domain (for OG tags)      |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Optional | Google AdSense               |

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit changes: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request

## License

MIT — see [LICENSE](LICENSE) for details.

---

Built with ❤️ to help travelers navigate visa requirements worldwide.
