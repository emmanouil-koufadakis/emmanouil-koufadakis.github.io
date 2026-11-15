# Emmanouil Koufadakis · CV website

A personal CV site styled like a TV streaming app: a featured billboard, rails of cards you can browse with the arrow keys, case-study pages, a downloadable PDF CV and a contact form. Built with [Astro](https://astro.build), Tailwind CSS v4 and a little vanilla TypeScript. Design notes live in [DESIGN.md](DESIGN.md).

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run check      # type-check
```

## Update the content

| What | Where |
|---|---|
| Name, pitch, about text, stats, contact links, availability | `src/data/cv.ts` → `profile` |
| Roles (cards, dialogs, full CV list, PDF) | `src/data/cv.ts` → `experience` |
| Client tiles, skills, education, languages | `src/data/cv.ts` |
| Case studies | `src/content/work/*.mdx` (one file per study) |
| Your photo | Save it as `src/assets/headshot.jpg` (or .png/.webp/.avif). It appears as a round avatar next to your name in the top bar, in place of the "EK" monogram. |

After changing content, regenerate the PDF and social image:

```bash
CV_PHONE="your phone number" SITE_URL="https://<username>.github.io" npm run render:assets
```

This writes `public/Emmanouil_Koufadakis_CV.pdf` and `public/og.png` using your installed Google Chrome. The phone number goes into the PDF only, never into the website's HTML. Both variables are optional and can also live in `.env` (see `.env.example`).

## Contact form

The form uses [Web3Forms](https://web3forms.com) (free). Create an access key with your email address, then:

- locally: put `PUBLIC_WEB3FORMS_KEY=...` in `.env`
- on GitHub: add a repository **variable** (not secret) named `PUBLIC_WEB3FORMS_KEY`

Without a key, the form opens the visitor's email app with the message filled in.

## Deploy (GitHub Pages)

1. Create a public repository named `<username>.github.io` on your personal GitHub account.
2. In the repository: **Settings → Pages → Source: GitHub Actions**.
3. Push to `main`. `.github/workflows/deploy.yml` builds and publishes the site to `https://<username>.github.io`.

## Privacy

`sources/` (original CVs, applications, notes) is git-ignored and never published. The site shows email, LinkedIn and town only.
