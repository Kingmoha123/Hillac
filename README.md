# Hillaac ICT Solutions Website

Premium corporate website for **Hillaac ICT Solutions**, a modern Somali technology company based in Mogadishu.

**Slogan:** `Xawaare. Hal-abuur. Xal.`

The website is built with **Next.js**, **React**, and **TypeScript**. It includes responsive pages, reusable components, dark mode, a custom SVG logo, service sections, portfolio case studies, contact forms, and a WhatsApp contact button.

## Features

- Modern premium corporate UI
- Fully responsive layout for desktop, tablet, and mobile
- Dark mode toggle
- Custom Hillaac lightning logo in SVG
- Home, About, Services, Portfolio, Industries, Technologies, Blog, Careers, and Contact pages
- Service cards for branding, websites, apps, systems, cloud, UI/UX, marketing, and video
- Portfolio/project showcase
- Process timeline
- Testimonials
- Contact form layout
- Floating WhatsApp button connected to `+252 61 728 6400`
- SEO-ready metadata
- Clean component-based folder structure

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- CSS custom properties
- ESLint

## Current Architecture

- `app/` contains App Router pages, metadata, API routes, sitemap, robots, manifest, and global styles.
- `components/` contains reusable UI, analytics consent, tracked links, contact form, portfolio cards, blog cards, and layout sections.
- `data/` contains structured site, portfolio, blog, and legal content.
- `lib/` contains SEO helpers, JSON-LD helpers, and privacy-conscious analytics utilities.
- `public/` contains static launch assets such as the default Open Graph image.

## Project Structure

```text
app/
  about/
  blog/
  careers/
  contact/
  industries/
  portfolio/
  services/
  technologies/
  globals.css
  layout.tsx
  page.tsx

components/
  ButtonLink.tsx
  ContactSection.tsx
  CtaSection.tsx
  Footer.tsx
  Header.tsx
  Hero.tsx
  Icon.tsx
  Logo.tsx
  PageHero.tsx
  PortfolioSection.tsx
  ServicesSection.tsx
  WhatsAppButton.tsx

data/
  site.ts
```

## Requirements

Install Node.js first.

Recommended:

```bash
node --version
npm --version
```

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build for Production

```bash
npm run build
```

## Start Production Server

```bash
npm run start
```

## Lint

```bash
npm run lint
```

## Full QA Commands

Run these before production release:

```bash
npm install
npm run lint
npx tsc --noEmit
npm run build
npm audit --omit=dev
```

There is no separate automated test script currently defined in `package.json`.

## Contact Form Email

The contact form posts to `/api/contact` and sends an email notification through Gmail SMTP from the server.
Secrets must stay in environment variables. Do not commit `.env.local`, and do not use the normal Gmail account password.

Create `.env.local` for local testing:

```text
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=hillacict@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM="Hillaac ICT Solutions <hillacict@gmail.com>"
CONTACT_TO_EMAIL=hillacict@gmail.com
```

To create the Gmail App Password:

1. Sign in to the `hillacict@gmail.com` Google Account.
2. Enable 2-Step Verification.
3. Open Google Account security settings and create an App Password for mail.
4. Put that app password in `SMTP_PASS` inside `.env.local`.
5. Restart the local Next.js server after changing environment variables.

Gmail may display the app password with spaces. The contact API removes spaces for Gmail SMTP, but keeping the value without spaces in `.env.local` is recommended.

For Vercel, add the same variables in Project Settings, Environment Variables.
Apply them to the production environment, then redeploy the site so the API route can read the new values.

## Analytics and Consent

Google Analytics 4 support is optional and privacy-conscious. Analytics stays disabled unless a GA4 Measurement ID is provided and the visitor accepts analytics in the cookie banner.

Add these values to `.env.local` for local testing:

```text
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ANALYTICS_DEBUG=false
```

Do not hardcode a real Measurement ID in the repository.

To create a GA4 property:

1. Open Google Analytics.
2. Create or select an account for Hillaac ICT Solutions.
3. Create a GA4 property and Web data stream for the website.
4. Copy the Measurement ID from the web stream. It usually starts with `G-`.
5. Put the value in `NEXT_PUBLIC_GA_MEASUREMENT_ID` inside `.env.local`.
6. Restart the local Next.js server after changing environment variables.

For Vercel, add `NEXT_PUBLIC_GA_MEASUREMENT_ID` and optional `NEXT_PUBLIC_ANALYTICS_DEBUG` in Project Settings, Environment Variables. Apply them to the production environment, then redeploy the site because Next.js reads public environment variables at build time.

Consent behavior:

- Analytics scripts do not load before the visitor accepts analytics.
- Rejecting analytics stores `hillaac_analytics_consent=rejected` in localStorage and keeps analytics disabled.
- Accepting analytics stores `hillaac_analytics_consent=accepted` in localStorage and enables GA4 page-view and conversion event tracking.
- Visitors can update the decision later from the footer Cookie Settings link.
- Contact form field values are never sent to analytics.

To verify analytics:

1. Set `NEXT_PUBLIC_ANALYTICS_DEBUG=true` only when intentionally debugging.
2. Accept analytics in the cookie banner.
3. Use GA4 DebugView for local debugging or Realtime reports for production checks.
4. Click key CTAs, portfolio cards, blog cards, WhatsApp links, and submit the contact form with safe test data.

Troubleshooting analytics:

- If the cookie banner does not appear, confirm `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set to a valid GA4 ID such as `G-XXXXXXXXXX`.
- If events do not show, accept analytics first and confirm the site was redeployed after adding Vercel environment variables.
- If testing locally, restart the dev server after editing `.env.local`.

## Admin Foundation

The admin foundation lives under `/admin` and is isolated from the public website chrome. It uses MongoDB with Mongoose, bcrypt password hashing, and a signed HTTP-only admin session cookie. Do not store admin tokens in localStorage and do not create public registration routes.

Required admin environment variables:

```text
MONGODB_URI=
AUTH_SECRET=
ADMIN_SEED_NAME=
ADMIN_SEED_EMAIL=
ADMIN_SEED_PASSWORD=
```

Generate `AUTH_SECRET` with a long random value, for example:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

MongoDB setup:

1. Create a MongoDB Atlas cluster or provide a secure MongoDB connection string.
2. Add the connection string to `MONGODB_URI` in `.env.local`.
3. Add the same variable in Vercel Project Settings, Environment Variables.
4. Redeploy Vercel after changing environment variables.

Create the first `SUPER_ADMIN` locally or in a secure one-time setup environment:

```bash
npm run seed:admin
```

The seed command reads `ADMIN_SEED_NAME`, `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD`, and `MONGODB_URI`. The password must be at least 12 characters and include uppercase, lowercase, and number characters. It hashes the password with bcrypt and avoids duplicate admin users by email.

After the first admin is created:

1. Remove `ADMIN_SEED_PASSWORD` from `.env.local`.
2. Remove seed credentials from Vercel Environment Variables.
3. Keep `MONGODB_URI` and `AUTH_SECRET` configured.
4. Visit `/admin/login` to sign in.

Admin security notes:

- Inactive admin users cannot log in.
- Login errors are generic and do not reveal whether an email exists.
- Login attempts are rate-limited in memory.
- Sessions use HTTP-only cookies with `sameSite=lax`; production cookies are marked secure.
- Only Dashboard and Settings are functional in this foundation. Other modules are protected placeholders for future CMS work.

## WhatsApp Contact

The floating WhatsApp button uses this number:

```text
+252 61 728 6400
```

The link is generated from:

```text
https://wa.me/252617286400
```

To change it, edit:

```text
data/site.ts
```

## Legal Pages

The Privacy Policy, Terms of Service, Cookie Policy, and Disclaimer pages are general website templates for launch readiness and transparency. Hillaac should obtain professional legal review before relying on them for regulated, high-risk, or contract-specific services.

## Known Launch Placeholders

- Portfolio projects are intentionally marked as placeholders until real screenshots, scope, technologies, years, links, and approved outcomes are available.
- Careers currently collects talent-pool interest and should not be treated as confirmed open vacancies.
- The site uses the deployed Vercel URL as a safe temporary URL until the final custom domain is verified.
- A stricter Content Security Policy is recommended after the final analytics, font, image, and deployment domains are confirmed.
- `npm audit --omit=dev` currently reports Next.js/PostCSS advisories where npm recommends a breaking Next.js major upgrade. Plan that upgrade with compatibility testing instead of applying `npm audit fix --force` blindly.

See [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md) for the full launch checklist.

## Main Content File

Most company information, services, portfolio items, blog posts, technologies, jobs, phone number, and email are stored in:

```text
data/site.ts
```

Update that file when you want to change business content.

## Push to GitHub

Create a new repository on GitHub, then run these commands in the project folder.

If this folder is not a git repository yet:

```bash
git init
git add .
git commit -m "Initial Hillaac ICT Solutions website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

If git is already initialized:

```bash
git status
git add .
git commit -m "Update Hillaac ICT Solutions website"
git push
```

## Important Files Not to Upload Manually

These files/folders should not be pushed to GitHub:

```text
node_modules/
.next/
dev-server.log
.env.local
```

They are ignored using `.gitignore`.

## Deploy

Recommended deployment platform:

- Vercel

Basic steps:

1. Push the project to GitHub.
2. Open Vercel.
3. Import the GitHub repository.
4. Use the default Next.js settings.
5. Add `NEXT_PUBLIC_SITE_URL` with the production URL for canonical links, sitemap, robots, and social sharing.
6. Deploy.

Use the deployed Vercel URL until a custom domain is verified. Replace `NEXT_PUBLIC_SITE_URL` after connecting the final domain.

## Troubleshooting Contact Email

- Confirm Gmail 2-Step Verification is enabled.
- Use a Gmail App Password, not the normal Gmail password.
- Confirm `SMTP_PASS` is configured locally or in Vercel and redeploy after changing Vercel variables.
- If the form shows an error, check server logs for SMTP configuration or authentication errors. The client intentionally receives only safe generic errors.

## Company

**Hillaac ICT Solutions**  
Mogadishu, Somalia  
`Xawaare. Hal-abuur. Xal.`
