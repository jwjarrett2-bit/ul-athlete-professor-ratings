# UL Athlete Professor Ratings

MVP Next.js App Router project for University of Louisiana student-athletes to rate professors by athlete friendliness.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

## Pages

- `/` homepage
- `/professors` professor search/list page
- `/professors/[id]` professor profile page with average scores and reviews
- `/review/[professorId]` logged-in review form
- `/admin/reviews` review moderation
- `/admin/professors` pending professor approval
- `/privacy` privacy page
- `/terms` terms page

## Data Model

- `Professor`: `id`, `firstName`, `lastName`, `fullName`, `department`, `college`, optional `email`, optional `title`, optional `sourceUrl`, `status`, timestamps
- `Review`: `id`, `professorId`, `sport`, `courseTaken`, `semesterTaken`, six 1-5 rating fields, `wouldTakeAgain`, `comment`, timestamps

Reviews include overall recommendation, athlete friendliness, flexibility, workload, attendance strictness, and communication.

## Getting Started

```bash
npm install
cp .env.example .env
npm run prisma:migrate
npm run db:seed
npm run dev
```

Set `DATABASE_URL` in `.env` for your PostgreSQL database.

## Launch

Use `DEPLOYMENT.md` for the full launch checklist with GitHub, Vercel, Neon, and Google OAuth.

Helpful launch commands:

```bash
npm run launch:check
npm run db:deploy
npm run import:professors
```

For production, add these environment variables in Vercel:

```text
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
ADMIN_EMAILS
```

## Import Professors From CSV

Put professor data in `data/ul-professors.csv` with these columns:

```csv
firstName,lastName,fullName,department,college,email,title,sourceUrl
```

Then run:

```bash
npm run import:professors
```

The importer skips duplicates using `fullName + department` and logs how many professors were created and skipped.

## Scrape UL Department Pages

The scraper config lives in `scripts/scrape-ul-professors.ts`. It visits the configured department faculty pages, extracts listed faculty when the page structure is readable, removes duplicates by `fullName + department`, and writes one combined CSV to `data/ul-professors.csv`.

```bash
npm run scrape:professors
```

Review the CSV before importing it. If a department page has a different structure, the scraper logs a warning and continues.
