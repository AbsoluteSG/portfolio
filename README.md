# alex-zaalishvili.vercel.app

Personal site and portfolio of Alex Zaalishvili — software engineer and indie game developer (Siphon Games), CS @ CUNY College of Staten Island, graduating Dec 2026.

**Live:** https://alex-zaalishvili.vercel.app · **Resume:** [/resume.pdf](public/resume.pdf)

## What's here

- **Projects** — Tutor Payroll (production Next.js/Postgres/Stripe app), Banana Clicker (Steam, 1,000+ sales), Vrox (server-authoritative multiplayer on SpacetimeDB), cmd_zoo (Rust open-world sim), and more. Data lives in `src/data/projects.ts`; longer write-ups are MDX posts in `src/content/`.
- **Experience / About / Contact** — sections on the single-page portfolio; contact form posts to `/api/contact` (Resend).
- **Blog** — MDX posts under `/blog` with reading time and frontmatter.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Base UI + shadcn-style components · Motion · MDX (`next-mdx-remote`, `gray-matter`) · react-hook-form + zod · Resend · deployed on Vercel.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional: RESEND_API_KEY + CONTACT_EMAIL for the contact form
npm run dev                  # http://localhost:3000
```

`npm run build` and `npm run lint` before pushing.

## Structure

```
src/app/(portfolio)/   single-page portfolio (hero, about, projects, experience, contact)
src/app/(blog)/        blog index + [slug] pages
src/app/api/contact/   Resend-backed contact endpoint (503 + mailto fallback when unconfigured)
src/components/        layout, sections, shared, ui
src/data/              projects, experience, skills, navigation, social links
src/content/           MDX posts
public/resume.pdf      current resume
```
