# Emmanouil Koufadakis · CV website

A personal CV site styled like a TV streaming app: a featured billboard, rails of cards you can browse with the arrow keys, case-study pages, a downloadable PDF CV and a contact form. It comes in English (at the root) and Greek (under `/el/`); the flags in the top bar switch between them. Built with [Astro](https://astro.build), Tailwind CSS v4 and a little vanilla TypeScript. Design notes live in [DESIGN.md](DESIGN.md).

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run check      # type-check
```

## Update the content

All text on the site, the PDF CV and the social image lives in one SQLite database: **`db/content.db`**. The site reads it when it is built; nothing reads it in visitors' browsers.

Open it with any SQLite app, for example [DB Browser for SQLite](https://sqlitebrowser.org) (free) or TablePlus:

| What | Where in the database |
|---|---|
| Any wording on the site: headings, buttons, role highlights, case studies, diagrams | `texts` table: `key`, `en` (English), `el` (Greek), `notes` |
| Role dates, platforms, which roles appear on the PDF | `roles`, `role_clients` |
| Client tiles, skills, education, certifications, languages, volunteering | `clients`, `skill_groups`, `education`, `certifications`, `languages`, `volunteering` |
| Recommendations, posts, case-study settings, hero stats, impact chart | `recommendations`, `posts`, `case_studies`, `stats`, `impact` |
| Email, LinkedIn, booking link, PDF file names (`cv_file`, and `cv_file_el` for Greek) | `settings` |
| Your photo | Save it as `src/assets/headshot.jpg` (or .png/.webp/.avif). It appears as a round avatar next to your name in the top bar, in place of the "EK" monogram. |

Tips:

- Text keys are readable dotted paths, e.g. `role.roku-lead.title` or `ui.hero.browse`. Lists use numbered keys (`role.roku-lead.highlight.1`, `.2`…); to add an item, add the next number.
- `{count}`, `{name}`, `{email}` and similar placeholders are filled in by the site; keep them in both languages.
- Every text has a Greek version in `el`. If you add a text and leave `el` empty, the Greek site shows the English. In Greek case studies, links to other site pages start with `/el/` (e.g. `/el/work/roku-mvvm-framework/`).
- Case study bodies (`case.<slug>.body`) are Markdown. A line `{{impact-chart}}` places the impact chart.
- The table structure and what each column means are documented in `db/schema.sql`.
- While `npm run dev` is running, saving the database reloads the page with the new text. A missing key stops the build with its name, so typos are caught before publishing.

After changing content, regenerate the PDFs and social images (English and Greek):

```bash
CV_PHONE="your phone number" SITE_URL="https://<username>.github.io" npm run render:assets
```

This writes `public/Emmanouil_Koufadakis_CV.pdf`, `public/og.png`, `public/Emmanouil_Koufadakis_CV_EL.pdf` and `public/og-el.png` using your installed Google Chrome. The phone number goes into the PDF only, never into the website's HTML. Both variables are optional and can also live in `.env` (see `.env.example`).

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
