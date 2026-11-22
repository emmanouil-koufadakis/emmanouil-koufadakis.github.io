/**
 * Reads all site content from db/content.db (SQLite) when the site is built.
 * Components call getContent(Astro.currentLocale) and get the text in that
 * language; any text without a Greek version falls back to English.
 * The database schema and editing notes are in db/schema.sql.
 */
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

export type Lang = 'en' | 'el';
export const LANGS: Lang[] = ['en', 'el'];
export const DB_PATH = path.join(process.cwd(), 'db', 'content.db');

export type PlatformId = 'roku' | 'apple-tv' | 'playstation' | 'windows' | 'web' | 'other';

export type Role = {
  id: string;
  title: string;
  company: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM, or undefined for a current role */
  end?: string;
  platform: PlatformId;
  clients: string[];
  summary: string;
  highlights: string[];
  /** Short level for the programme guide, e.g. "Lead". */
  level: string;
  caseStudy?: string;
  onCv: boolean;
};
export type Client = { name: string; platforms: PlatformId[]; hue: number };
export type SkillGroup = { id: string; name: string; items: string[] };
export type Education = { id: string; degree: string; detail: string; school: string; year: string; dissertation: string };
export type Certification = { id: string; name: string; issuer: string; date: string; url?: string; topics: string[]; hue: number };
export type Language = { id: string; name: string; level: string };
export type Volunteering = { id: string; role: string; org: string; year: string; detail: string };
export type Recommendation = { id: string; name: string; role: string; relationship: string; date: string; quote: string; hue: number };
export type Post = {
  id: string;
  kind: 'linkedin' | 'article';
  kindLabel: string;
  title: string;
  subtitle?: string;
  /** YYYY-MM-DD */
  date: string;
  format?: string;
  summary: string;
  topics: string[];
  url: string;
  hue: number;
};
export type CaseStudy = {
  slug: string;
  order: number;
  platform: PlatformId;
  hue: number;
  diagram?: string;
  title: string;
  subtitle: string;
  client: string;
  role: string;
  period: string;
  team?: string;
  metric?: { value: string; label: string };
  summary: string;
  tags: string[];
  /** Markdown; a line "{{impact-chart}}" places the impact chart. */
  body: string;
};

/* ---------- language-independent helpers ---------- */

/** Months since year 0, so dates can be compared and subtracted. */
export const monthIndex = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
};

/** The current month (at build time; each deploy refreshes it). */
export const currentMonthIndex = () => {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
};

/** Months in a role, counting both the first and last month. */
export const roleMonths = (role: Pick<Role, 'start' | 'end'>) =>
  (role.end ? monthIndex(role.end) : currentMonthIndex()) - monthIndex(role.start) + 1;

/* ---------- loading ---------- */

type Row = Record<string, string | number | null>;

function load(lang: Lang) {
  const db = new DatabaseSync(DB_PATH, { readOnly: true });
  const all = (sql: string) => db.prepare(sql).all() as Row[];

  // Texts, in the requested language with English as the fallback.
  const text = new Map<string, string>();
  for (const r of all('SELECT key, en, el FROM texts')) {
    const el = typeof r.el === 'string' ? r.el.trim() : '';
    text.set(String(r.key), lang === 'el' && el ? el : String(r.en));
  }
  // Numbered keys ("x.highlight.1", ".2" ...) grouped into ordered lists.
  const lists = new Map<string, [number, string][]>();
  for (const [key, value] of text) {
    const m = key.match(/^(.*)\.(\d+)$/);
    if (!m) continue;
    const items = lists.get(m[1]) ?? [];
    items.push([Number(m[2]), value]);
    lists.set(m[1], items);
  }

  /** Text by key, with {placeholders} filled in. Missing keys stop the build, so typos are caught early. */
  const t = (key: string, vars?: Record<string, string | number>) => {
    const value = text.get(key);
    if (value === undefined) throw new Error(`Missing text "${key}" in db/content.db`);
    return vars ? value.replace(/\{(\w+)\}/g, (all, k) => (k in vars ? String(vars[k]) : all)) : value;
  };
  /** Optional text: undefined when the key is not in the database. */
  const opt = (key: string) => text.get(key);
  /** Ordered list of numbered texts under a prefix. */
  const list = (prefix: string) => (lists.get(prefix) ?? []).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

  const settings = Object.fromEntries(all('SELECT key, value FROM settings').map((r) => [String(r.key), String(r.value)]));
  const setting = (key: string) => settings[key] ?? '';

  /* ----- language-aware formatting ----- */
  const formatMonth = (ym: string) => {
    const [y, m] = ym.split('-').map(Number);
    return `${t(`ui.month.${m}`)} ${y}`;
  };
  const formatPeriod = (role: Pick<Role, 'start' | 'end'>) =>
    `${formatMonth(role.start)} – ${role.end ? formatMonth(role.end) : t('ui.date.present')}`;
  /** Compact years for card art, e.g. "2020–23" or "2026–now". */
  const shortYears = (role: Pick<Role, 'start' | 'end'>) => {
    const s = role.start.slice(0, 4);
    if (!role.end) return `${s}–${t('ui.date.now')}`;
    const e = role.end.slice(0, 4);
    return s === e ? s : `${s}–${e.slice(2)}`;
  };
  /** Rounded down to the half year: 76 months → "6+ yrs", 43 → "3.5+ yrs", 11 → "11 months". */
  const formatDuration = (months: number) => {
    if (months < 12) return t('ui.duration.months', { n: months });
    const years = Math.floor(months / 6) / 2;
    return t('ui.duration.years', { n: `${years}${months % 6 ? '+' : ''}` });
  };

  /* ----- platforms ----- */
  const platformRows = all('SELECT id, sort, hue, badge, in_guide FROM platforms ORDER BY sort');
  const platformStyle = Object.fromEntries(
    platformRows.map((r) => [String(r.id), { hue: Number(r.hue), badge: String(r.badge), name: t(`platform.${r.id}.name`) }]),
  ) as Record<PlatformId, { hue: number; badge: string; name: string }>;
  const guidePlatforms = platformRows
    .filter((r) => Number(r.in_guide) > 0)
    .sort((a, b) => Number(a.in_guide) - Number(b.in_guide))
    .map((r) => ({ platform: String(r.id) as PlatformId, label: t(`platform.${r.id}.guide_label`) }));

  /* ----- profile ----- */
  const profile = {
    name: t('profile.name'),
    knownAs: t('profile.known_as'),
    initials: t('profile.initials'),
    credentials: t('profile.credentials'),
    headline: t('profile.headline'),
    pitch: t('profile.pitch'),
    about: list('profile.about'),
    cvSummary: t('profile.cv_summary'),
    location: t('profile.location'),
    email: setting('email'),
    linkedin: setting('linkedin_url'),
    linkedinLabel: setting('linkedin_label'),
    recommendationsUrl: setting('recommendations_url'),
    bookingUrl: setting('booking_url'),
    bookingNote: t('profile.booking_note'),
    availability: t('profile.availability'),
    workPreference: t('profile.work_preference'),
    stats: all('SELECT id, value FROM stats ORDER BY sort').map((r) => ({ value: String(r.value), label: t(`stat.${r.id}.label`) })),
    cvFile: setting('cv_file'),
  };

  /* ----- experience and clients ----- */
  const roleClients = all('SELECT role_id, client FROM role_clients ORDER BY role_id, sort');
  const experience: Role[] = all('SELECT * FROM roles ORDER BY sort').map((r) => ({
    id: String(r.id),
    title: t(`role.${r.id}.title`),
    company: t(`role.${r.id}.company`),
    start: String(r.start),
    end: r.end ? String(r.end) : undefined,
    platform: String(r.platform) as PlatformId,
    clients: roleClients.filter((c) => c.role_id === r.id).map((c) => String(c.client)),
    summary: t(`role.${r.id}.summary`),
    highlights: list(`role.${r.id}.highlight`),
    level: t(`role.${r.id}.level`),
    caseStudy: r.case_study ? String(r.case_study) : undefined,
    onCv: Number(r.on_cv) === 1,
  }));
  const clientPlatforms = all('SELECT client, platform FROM client_platforms ORDER BY client, sort');
  const clients: Client[] = all('SELECT name, hue FROM clients ORDER BY sort').map((r) => ({
    name: String(r.name),
    hue: Number(r.hue),
    platforms: clientPlatforms.filter((c) => c.client === r.name).map((c) => String(c.platform) as PlatformId),
  }));

  /* ----- everything else ----- */
  const skills: SkillGroup[] = all('SELECT id FROM skill_groups ORDER BY sort').map((r) => ({
    id: String(r.id),
    name: t(`skills.${r.id}.name`),
    items: list(`skills.${r.id}.item`),
  }));
  const education: Education[] = all('SELECT id, year FROM education ORDER BY sort').map((r) => ({
    id: String(r.id),
    degree: t(`education.${r.id}.degree`),
    detail: opt(`education.${r.id}.detail`) ?? '',
    school: t(`education.${r.id}.school`),
    year: String(r.year),
    dissertation: opt(`education.${r.id}.dissertation`) ?? '',
  }));
  const certifications: Certification[] = all('SELECT * FROM certifications ORDER BY sort').map((r) => ({
    id: String(r.id),
    name: t(`cert.${r.id}.name`),
    issuer: t(`cert.${r.id}.issuer`),
    date: formatMonth(String(r.month)),
    url: r.url ? String(r.url) : undefined,
    topics: list(`cert.${r.id}.topic`),
    hue: Number(r.hue),
  }));
  const languages: Language[] = all('SELECT id FROM languages ORDER BY sort').map((r) => ({
    id: String(r.id),
    name: t(`language.${r.id}.name`),
    level: t(`language.${r.id}.level`),
  }));
  const volunteering: Volunteering[] = all('SELECT id, year FROM volunteering ORDER BY sort').map((r) => ({
    id: String(r.id),
    role: t(`volunteering.${r.id}.role`),
    org: t(`volunteering.${r.id}.org`),
    year: String(r.year),
    detail: t(`volunteering.${r.id}.detail`),
  }));
  const recommendations: Recommendation[] = all('SELECT * FROM recommendations ORDER BY sort').map((r) => ({
    id: String(r.id),
    name: t(`rec.${r.id}.name`),
    role: t(`rec.${r.id}.role`),
    relationship: t(`rec.${r.id}.relationship`),
    date: formatMonth(String(r.month)),
    quote: t(`rec.${r.id}.quote`),
    hue: Number(r.hue),
  }));
  const posts: Post[] = all('SELECT * FROM posts ORDER BY sort').map((r) => ({
    id: String(r.id),
    kind: String(r.kind) as Post['kind'],
    kindLabel: t(`ui.post.kind.${r.kind}`),
    title: t(`post.${r.id}.title`),
    subtitle: opt(`post.${r.id}.subtitle`),
    date: String(r.date),
    format: opt(`post.${r.id}.format`),
    summary: t(`post.${r.id}.summary`),
    topics: list(`post.${r.id}.topic`),
    url: String(r.url),
    hue: Number(r.hue),
  }));
  const caseStudies: CaseStudy[] = all('SELECT * FROM case_studies ORDER BY sort').map((r) => {
    const k = `case.${r.slug}`;
    const metricValue = opt(`${k}.metric_value`);
    return {
      slug: String(r.slug),
      order: Number(r.sort),
      platform: String(r.platform) as PlatformId,
      hue: Number(r.hue),
      diagram: r.diagram ? String(r.diagram) : undefined,
      title: t(`${k}.title`),
      subtitle: t(`${k}.subtitle`),
      client: t(`${k}.client`),
      role: t(`${k}.role`),
      period: t(`${k}.period`),
      team: opt(`${k}.team`),
      metric: metricValue ? { value: metricValue, label: t(`${k}.metric_label`) } : undefined,
      summary: t(`${k}.summary`),
      tags: list(`${k}.tag`),
      body: t(`${k}.body`),
    };
  });
  const mvvmImpact = all('SELECT * FROM impact ORDER BY sort').map((r) => ({
    label: t(`impact.${r.id}.label`),
    after: [Number(r.after_low), Number(r.after_high)] as [number, number],
    change: t(`impact.${r.id}.change`),
  }));

  db.close();

  return {
    lang,
    t,
    opt,
    list,
    setting,
    formatMonth,
    formatPeriod,
    shortYears,
    formatDuration,
    monthIndex,
    currentMonthIndex,
    roleMonths,
    platformStyle,
    guidePlatforms,
    profile,
    experience,
    clients,
    skills,
    education,
    certifications,
    languages,
    volunteering,
    recommendations,
    posts,
    caseStudies,
    mvvmImpact,
  };
}

export type Content = ReturnType<typeof load>;

const cache = new Map<Lang, Content>();

/** All content in one language (English unless the locale is Greek). Read once per build. */
export function getContent(locale?: string): Content {
  const lang: Lang = locale === 'el' ? 'el' : 'en';
  let content = cache.get(lang);
  if (!content) {
    content = load(lang);
    cache.set(lang, content);
  }
  return content;
}
