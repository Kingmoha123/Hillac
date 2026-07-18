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

## Contact Form Email

The contact form posts to `/api/contact` and sends an email notification from the server.
Create `.env.local` for local testing and add matching variables in production:

```text
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM="Hillaac Website <no-reply@hillaac.com>"
CONTACT_TO_EMAIL=info@hillaac.com
```

Optional:

```text
SMTP_SECURE=true
SMTP_STARTTLS=false
```

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
5. Deploy.

## Company

**Hillaac ICT Solutions**  
Mogadishu, Somalia  
`Xawaare. Hal-abuur. Xal.`
