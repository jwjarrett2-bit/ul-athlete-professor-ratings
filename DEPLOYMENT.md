# Launch Guide

This guide gets the UL Athlete Professor Ratings app ready for outside testers with GitHub, Vercel, Neon PostgreSQL, and Google login.

## 1. Put the project on GitHub

Create a GitHub account if you do not already have one, then create a new repository named:

```text
ul-athlete-professor-ratings
```

Private is fine for now. After the repository exists, push this project folder to GitHub.

## 2. Create the Neon database

Create a Neon account and make a new PostgreSQL project.

Copy the Neon connection string. Neon may show both a pooled and direct connection string:

- Use the pooled connection string for `DATABASE_URL` in Vercel.
- Use the direct connection string when running Prisma migrations manually.

The connection string should look roughly like this:

```text
postgresql://user:password@host/dbname?sslmode=require
```

Do not commit the real database URL to GitHub.

## 3. Prepare the production database

Before outside testers use the site, the Neon database needs the app tables and professor data.

Temporarily set your local `.env` `DATABASE_URL` to the Neon connection string, then run:

```bash
npm run launch:db
```

That command runs Prisma production migrations and imports `data/ul-professors.csv`.

After it finishes, put your local `.env` back to your local database URL if you still want to test locally.

## 4. Create the Vercel project

Create a Vercel account and connect it to GitHub. Import the GitHub repository.

Vercel should detect Next.js automatically.

Use the default build settings:

```text
Build Command: npm run build
Install Command: npm install
Output Directory: leave blank
```

## 5. Add Vercel environment variables

In Vercel, open the project settings and add these environment variables:

```env
DATABASE_URL="your-neon-database-url"
NEXTAUTH_URL="https://your-vercel-site.vercel.app"
NEXTAUTH_SECRET="random-secret-value"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
ADMIN_EMAILS="your-email@example.com"
BETA_REVIEW_MODE="false"
```

Notes:

- `NEXTAUTH_URL` must exactly match the final Vercel site URL.
- `NEXTAUTH_SECRET` should be a long random value.
- `ADMIN_EMAILS` can contain multiple emails separated by commas.
- Set `BETA_REVIEW_MODE` to `true` for a same-day beta if Google login is blocking reviews. Turn it back to `false` when Google login is fixed.

## 6. Update Google OAuth

In Google Cloud Console, open the OAuth client used by the app.

Keep the local development values:

```text
Authorized JavaScript origin:
http://localhost:3000

Authorized redirect URI:
http://localhost:3000/api/auth/callback/google
```

Add the production Vercel values:

```text
Authorized JavaScript origin:
https://your-vercel-site.vercel.app

Authorized redirect URI:
https://your-vercel-site.vercel.app/api/auth/callback/google
```

If the Vercel URL changes, update both Google and `NEXTAUTH_URL`.

## 7. Deploy

Deploy from Vercel.

If you change environment variables after the first deploy, redeploy the site so Vercel uses the new values.

## 8. Final tester checklist

Before sending the link to outside testers, confirm:

- Homepage loads on desktop and phone.
- Professor search works.
- Professor profile pages load.
- Google login works.
- A logged-in user can submit a review.
- The same user cannot review the same professor and course twice.
- "Professor not listed?" creates a pending professor.
- Pending professors do not appear publicly.
- Admin can approve and reject professors at `/admin/professors`.
- Reported reviews stay visible publicly.
- Admin can hide and restore reviews at `/admin/reviews`.
- Privacy and terms pages load.
- Non-admin users cannot access admin pages.

## Useful commands

Run a production-style build check:

```bash
npm run launch:check
```

Run production migrations only:

```bash
npm run db:deploy
```

Import professor CSV only:

```bash
npm run import:professors
```
