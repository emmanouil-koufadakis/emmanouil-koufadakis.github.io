-- Content database for the CV website (SQLite).
-- The site reads db/content.db when it is built; edit it with any SQLite app
-- (for example DB Browser for SQLite or TablePlus), then rebuild or push.
--
-- texts: every piece of human-readable text, English and Greek side by side.
--   key   dotted path, e.g. "role.roku-lead.title" or "ui.hero.download_cv"
--   en    English (required)
--   el    Greek (optional; when empty the English text is used)
--   notes optional hint for editing or translating
-- Lists use numbered keys: "role.roku-lead.highlight.1", ".2", ...
-- Text may contain {placeholders} that the site fills in, e.g. {count}.
--
-- The other tables hold only what is not prose: dates, platforms, colours,
-- links, brand names and the order things appear in ("sort", lowest first).

CREATE TABLE texts (
  key   TEXT PRIMARY KEY,
  en    TEXT NOT NULL,
  el    TEXT,
  notes TEXT
);

-- Single values that are not translated: email, links, file paths.
CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Platforms: colour (OKLCH hue) and badge for card artwork.
-- in_guide > 0 shows the platform as a row in the career programme guide (in that order).
-- Text: platform.<id>.name, platform.<id>.guide_label
CREATE TABLE platforms (
  id       TEXT PRIMARY KEY,
  sort     INTEGER NOT NULL,
  hue      INTEGER NOT NULL,
  badge    TEXT NOT NULL,
  in_guide INTEGER NOT NULL DEFAULT 0
);

-- Hero stats. Text: stat.<id>.label
CREATE TABLE stats (
  id    TEXT PRIMARY KEY,
  sort  INTEGER NOT NULL,
  value TEXT NOT NULL
);

-- Experience. start/end are YYYY-MM; end is empty for the current role.
-- on_cv = 1 shows the role in full on the PDF CV.
-- Text: role.<id>.title, .company, .summary, .highlight.<n>
CREATE TABLE roles (
  id         TEXT PRIMARY KEY,
  sort       INTEGER NOT NULL,
  start      TEXT NOT NULL,
  end        TEXT,
  platform   TEXT NOT NULL REFERENCES platforms(id),
  case_study TEXT REFERENCES case_studies(slug),
  on_cv      INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE role_clients (
  role_id TEXT NOT NULL REFERENCES roles(id),
  sort    INTEGER NOT NULL,
  client  TEXT NOT NULL,
  PRIMARY KEY (role_id, sort)
);

-- Client name tiles. Names are brand names, so they are not translated.
CREATE TABLE clients (
  name TEXT PRIMARY KEY,
  sort INTEGER NOT NULL,
  hue  INTEGER NOT NULL
);

CREATE TABLE client_platforms (
  client   TEXT NOT NULL REFERENCES clients(name),
  sort     INTEGER NOT NULL,
  platform TEXT NOT NULL REFERENCES platforms(id),
  PRIMARY KEY (client, sort)
);

-- Text: skills.<id>.name, skills.<id>.item.<n>
CREATE TABLE skill_groups (
  id   TEXT PRIMARY KEY,
  sort INTEGER NOT NULL
);

-- Text: education.<id>.degree, .detail, .school, .dissertation
CREATE TABLE education (
  id   TEXT PRIMARY KEY,
  sort INTEGER NOT NULL,
  year TEXT NOT NULL
);

-- month is YYYY-MM. Text: cert.<id>.name, .issuer, .topic.<n>
CREATE TABLE certifications (
  id    TEXT PRIMARY KEY,
  sort  INTEGER NOT NULL,
  month TEXT NOT NULL,
  url   TEXT,
  hue   INTEGER NOT NULL
);

-- Text: language.<id>.name, .level
CREATE TABLE languages (
  id   TEXT PRIMARY KEY,
  sort INTEGER NOT NULL
);

-- Text: volunteering.<id>.role, .org, .detail
CREATE TABLE volunteering (
  id   TEXT PRIMARY KEY,
  sort INTEGER NOT NULL,
  year TEXT NOT NULL
);

-- LinkedIn recommendations; month is YYYY-MM.
-- Text: rec.<id>.name, .role, .relationship, .quote
CREATE TABLE recommendations (
  id    TEXT PRIMARY KEY,
  sort  INTEGER NOT NULL,
  month TEXT NOT NULL,
  hue   INTEGER NOT NULL
);

-- Posts and articles; kind is "linkedin" or "article"; date is YYYY-MM-DD.
-- Text: post.<id>.title, .subtitle, .format, .summary, .topic.<n>
CREATE TABLE posts (
  id   TEXT PRIMARY KEY,
  sort INTEGER NOT NULL,
  kind TEXT NOT NULL,
  date TEXT NOT NULL,
  url  TEXT NOT NULL,
  hue  INTEGER NOT NULL
);

-- Case studies. diagram = "mvvm" adds the architecture and UML sections.
-- Text: case.<slug>.title, .subtitle, .client, .role, .period, .team,
--       .metric_value, .metric_label, .summary, .tag.<n>, .body (Markdown;
--       a line "{{impact-chart}}" places the impact chart)
CREATE TABLE case_studies (
  slug     TEXT PRIMARY KEY,
  sort     INTEGER NOT NULL,
  platform TEXT NOT NULL REFERENCES platforms(id),
  hue      INTEGER NOT NULL,
  diagram  TEXT
);

-- Roku MVVM framework impact chart, indexed so "before" = 100.
-- Text: impact.<id>.label, .change
CREATE TABLE impact (
  id         TEXT PRIMARY KEY,
  sort       INTEGER NOT NULL,
  after_low  INTEGER NOT NULL,
  after_high INTEGER NOT NULL
);
