# Hillaac ICT Solutions Launch Checklist

Use this checklist before moving the website from launch candidate to active client acquisition.

## Environment Variables

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the final production URL.
- [ ] Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` after creating the GA4 web stream.
- [ ] Keep `NEXT_PUBLIC_ANALYTICS_DEBUG=false` in production.
- [ ] Set `MONGODB_URI` for admin authentication and future CMS content.
- [ ] Set a strong `AUTH_SECRET` for admin session signing.
- [ ] Set Cloudinary variables for portfolio image uploads: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
- [ ] Set Gmail SMTP variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and `CONTACT_TO_EMAIL`.
- [ ] Confirm `.env.local` is not committed.

## Admin Foundation

- [ ] Create the first `SUPER_ADMIN` with `npm run seed:admin`.
- [ ] Remove `ADMIN_SEED_PASSWORD` after the first admin is created.
- [ ] Confirm `/admin/login` is reachable.
- [ ] Confirm unauthenticated `/admin` visitors redirect to `/admin/login`.
- [ ] Confirm authenticated admins can view Dashboard and update their own display name.
- [ ] Seed local portfolio entries with `npm run seed:portfolio` after MongoDB is configured.
- [ ] Verify portfolio create/edit/publish/preview/archive flows.
- [ ] Confirm no public registration route exists.

## Contact And Email

- [ ] Enable Gmail 2-Step Verification for `hillacict@gmail.com`.
- [ ] Create a Gmail App Password and place it only in `SMTP_PASS`.
- [ ] Submit a local contact-form test only when valid local credentials are available.
- [ ] Submit a production contact-form test after Vercel environment variables are configured.
- [ ] Confirm success, validation, loading, double-submit prevention, honeypot, and safe error states.

## Analytics And Consent

- [ ] Create a Google Analytics 4 property and web data stream.
- [ ] Add the Measurement ID to Vercel Environment Variables.
- [ ] Redeploy after adding public environment variables.
- [ ] Verify analytics does not load before consent.
- [ ] Verify Reject analytics keeps GA disabled.
- [ ] Verify Accept analytics enables page views and conversion events.
- [ ] Verify Cookie Settings can update the decision.
- [ ] Verify events in GA4 DebugView or Realtime reports.

## Deployment

- [ ] Import or connect the GitHub repository in Vercel.
- [ ] Deploy from the intended production branch.
- [ ] Confirm `/api/health` returns safe status information only.
- [ ] Confirm `npm run build` passes in Vercel.
- [ ] Review `npm audit --omit=dev` findings and plan a tested Next.js major upgrade when security fixes require it.
- [ ] Confirm backup and rollback steps are understood before launch.

## Domain, DNS, And HTTPS

- [ ] Confirm the final custom domain.
- [ ] Configure DNS records in the domain provider.
- [ ] Connect the domain in Vercel.
- [ ] Confirm HTTPS is active.
- [ ] Update `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy.

## SEO And Discovery

- [ ] Verify page titles, descriptions, canonical URLs, Open Graph, and Twitter metadata.
- [ ] Verify `/sitemap.xml` and `/robots.txt`.
- [ ] Submit the sitemap in Google Search Console.
- [ ] Replace the temporary social preview image if a final brand Open Graph image becomes available.
- [ ] Confirm JSON-LD contains only verified public claims.

## Portfolio And Content

- [ ] Add real portfolio screenshots.
- [ ] Confirm project names, scope, services, technologies, years, status, live links, and GitHub links where appropriate.
- [ ] Replace placeholder project outcomes with verified results only.
- [ ] Confirm the physical address and final public email/domain before publishing broad campaigns.
- [ ] Review Careers talent-pool wording and publish only confirmed vacancies when available.

## Legal And Policy

- [ ] Obtain professional legal review of Privacy Policy, Terms of Service, Cookie Policy, and Disclaimer.
- [ ] Confirm data retention expectations.
- [ ] Confirm analytics consent requirements for the target jurisdictions.
- [ ] Update policies if analytics, advertising pixels, session recording, or additional processors are added.

## Manual QA

- [ ] Test Home, About, Services, Portfolio, each case study, Industries, Technologies, Blog, each article, Careers, Contact, legal pages, and 404.
- [ ] Test at approximately 360px, 390px, 768px, 1024px, and 1440px widths.
- [ ] Test keyboard navigation, focus states, mobile menu, forms, CTA links, footer links, and cookie consent.
- [ ] Test current Chrome, Safari, Firefox, and Edge where available.
- [ ] Check console output for hydration errors and runtime errors.
