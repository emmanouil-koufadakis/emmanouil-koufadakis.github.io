/**
 * All CV content for the site and the PDF lives here.
 * Edit this file to update the website; case studies live in src/content/work/.
 */

export type Platform = 'Roku' | 'Apple TV' | 'PlayStation' | 'Windows' | 'Web' | 'Other';

/** Hue (OKLCH degrees) and short badge text per platform, used for card artwork. */
export const platformStyle: Record<Platform, { hue: number; badge: string }> = {
  Roku: { hue: 300, badge: 'ROKU' },
  'Apple TV': { hue: 235, badge: 'tvOS' },
  PlayStation: { hue: 258, badge: 'PS4 · PS3' },
  Windows: { hue: 200, badge: 'UWP · XBOX' },
  Web: { hue: 30, badge: 'WEB' },
  Other: { hue: 140, badge: 'OPS' },
};

export const profile = {
  name: 'Emmanouil Koufadakis',
  knownAs: 'Manos',
  initials: 'EK',
  credentials: 'MSc',
  headline: 'Senior Roku Engineer',
  pitch:
    'I build Roku and OTT apps for broadcasters and streaming brands: fast to load, easy to maintain and ready for certification.',
  about: [
    'I have spent 16+ years in software, almost 7 of them building Roku apps in BrightScript and SceneGraph for BBC, Channel 5, Showtime, Crackle and Univision. Today I work as a contract Senior Roku Engineer at Deltatre.',
    'I am hands-on with the Roku Advertising Framework (RAF), EPG and parental controls, HLS/DASH playback, DRM and analytics, and I enjoy the detective work of tuning load time and memory across Roku devices. Before Roku, I led app teams on PlayStation, Apple TV, Windows, Xbox and the web for ESPN, CBS, NHL, WWE, Camelot and UEFA.',
  ],
  /** Short, CV-style summary used on the PDF. */
  cvSummary:
    'Senior Roku engineer with 16+ years in software, including almost 7 years building and deploying Roku apps in BrightScript and SceneGraph for BBC, Channel 5, Showtime, Crackle and Univision. Hands-on with the Roku Advertising Framework (RAF), EPG and parental controls, HLS/DASH playback, DRM and analytics, and with tuning load time and memory use across Roku devices. Built a custom Roku MVVM framework that cut page data-loading time by 30–40%. Currently a contract Senior Roku Engineer at Deltatre. Earlier led PlayStation, Apple TV, Windows, Xbox and web app teams for ESPN, CBS, NHL, WWE, Camelot and UEFA.',
  location: 'Surbiton, Surrey, UK',
  email: 'manos.koufadakis@gmail.com',
  linkedin: 'https://www.linkedin.com/in/emmanouil-koufadakis',
  linkedinLabel: 'linkedin.com/in/emmanouil-koufadakis',
  recommendationsUrl: 'https://www.linkedin.com/in/emmanouil-koufadakis/details/recommendations/',
  availability: 'Available within 30 days',
  workPreference: 'Contract or permanent · remote or London',
  stats: [
    { value: '16+', label: 'years in software' },
    { value: '~7', label: 'years building for Roku' },
    { value: '30–40%', label: 'page load time saved by my Roku MVVM framework' },
  ],
  cvFile: '/Emmanouil_Koufadakis_CV.pdf',
};

export type Role = {
  id: string;
  title: string;
  company: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM, or undefined for a current role */
  end?: string;
  platform: Platform;
  clients: string[];
  summary: string;
  highlights: string[];
  /** Slug of a case study in src/content/work */
  caseStudy?: string;
  /** Shown on the PDF? Early roles are trimmed to keep it to two pages. */
  onCv?: boolean;
};

export const experience: Role[] = [
  {
    id: 'roku-consultant',
    title: 'Senior Roku Engineer (Contract)',
    company: 'Deltatre',
    start: '2026-06',
    platform: 'Roku',
    clients: ['Deltatre'],
    summary: 'Contract Roku engineering and consultancy for OTT streaming apps, working remotely.',
    highlights: [
      'Advise client engineering teams on Roku best practice, performance, app architecture and certification requirements.',
      'Build and maintain OTT apps in BrightScript and SceneGraph using an MVVM architecture with reusable UI components.',
      'Implement VOD and Live TV features, including video playback, advertising and DRM integrations.',
    ],
    onCv: true,
  },
  {
    id: 'roku-lead',
    title: 'Lead Roku Developer',
    company: 'UIC Digital',
    start: '2023-10',
    end: '2025-11',
    platform: 'Roku',
    clients: ['BBC', 'Channel 5'],
    summary: 'Owned Roku development for UK broadcasters, from architecture to production release.',
    highlights: [
      'Spearheaded Roku development for UK broadcasters BBC and Channel 5, owning the full lifecycle from architecture to production release.',
      "Wrote the team's Roku documentation on code conventions and best coding practices, which became the standard onboarding resource for new Roku developers.",
      'Set design and coding standards for the Roku team and mentored junior developers.',
    ],
    caseStudy: 'bbc-channel-5-roku',
    onCv: true,
  },
  {
    id: 'roku-senior',
    title: 'Senior Roku Engineer',
    company: 'UIC Digital',
    start: '2020-02',
    end: '2023-09',
    platform: 'Roku',
    clients: ['Showtime', 'Crackle', 'Univision'],
    summary: 'Built high-performance Roku apps and the in-house MVVM framework behind them.',
    highlights: [
      'Architected a custom Roku MVVM framework for page navigation, focus handling and API data loading. It cut page data-loading time by 30–40% and code typing time by 50%, and became the foundation for later apps including Crackle and BBC.',
      'Delivered and maintained high-performance Roku apps for Showtime, Crackle and Univision.',
      'Tracked down memory and start-up issues across multiple Roku devices and OS versions.',
    ],
    caseStudy: 'roku-mvvm-framework',
    onCv: true,
  },
  {
    id: 'apple-tv',
    title: 'Apple TVML/TVJS Developer',
    company: 'UIC Digital',
    start: '2019-03',
    end: '2020-01',
    platform: 'Apple TV',
    clients: [],
    summary: 'Led an Apple TV app for organising and playing local media.',
    highlights: [
      'Led an Apple TV app (TVML/TVJS) that lets users organise and play local media content.',
      "Used Apple's TVML templates to build fast, modern TV interfaces.",
    ],
    onCv: true,
  },
  {
    id: 'playstation',
    title: 'Lead JavaScript PS4/PS3 Developer',
    company: 'UIC Digital',
    start: '2016-01',
    end: '2019-02',
    platform: 'PlayStation',
    clients: ['ESPN', 'CBS', 'NHL', 'WWE'],
    summary: 'Led PlayStation app development for major US sports and entertainment brands.',
    highlights: [
      'Appointed by Disney to lead development of the ESPN PlayStation 4 app.',
      "Built PlayStation 4/3 apps for ESPN, CBS, NHL and WWE, meeting Sony's performance, stability and platform compliance requirements.",
      'Led a team of 4–5 engineers and mentored junior developers.',
      'Contributed to the in-house JavaScript/XML framework for Sony Trilithium apps.',
    ],
    caseStudy: 'espn-playstation-4',
    onCv: true,
  },
  {
    id: 'windows-lead',
    title: 'Lead Windows 8/10 Developer',
    company: 'UIC Digital',
    start: '2015-02',
    end: '2016-01',
    platform: 'Windows',
    clients: ['Camelot', 'HowStuffWorks', 'MediaCore'],
    summary: 'Led Windows and UWP app teams, and won Microsoft investment for MediaCore.',
    highlights: [
      'Secured Microsoft investment for Phase 2 of MediaCore, a university lecture recording and media upload app.',
      'Led a team of 5–6 engineers building Windows and UWP apps for Camelot and HowStuffWorks.',
      'Mentored junior developers in the Windows team.',
    ],
    caseStudy: 'mediacore',
    onCv: true,
  },
  {
    id: 'windows',
    title: 'Windows 8/10 · Windows Phone · UWP Developer',
    company: 'UIC Digital',
    start: '2012-07',
    end: '2015-01',
    platform: 'Windows',
    clients: ['Camelot', 'CBS', 'Showtime', 'WWE', 'HowStuffWorks'],
    summary: 'Built Windows, Xbox and UWP apps, plus the analytics library every UWP app at UIC came to use.',
    highlights: [
      'Built and maintained UWP apps for Windows and Xbox for clients including Camelot, CBS, Showtime, WWE and HowStuffWorks.',
      'Built, and later led, a Windows 8/8.1 line-of-business app for Camelot that replaced manual spreadsheet-driven processes.',
      'Designed a custom .NET Adobe Analytics (Omniture) library that added features the official library lacked; it became the standard across all UWP apps at UIC Digital.',
    ],
    onCv: true,
  },
  {
    id: 'flash-lead',
    title: 'Lead Flash/AS3 Developer',
    company: 'UIC Digital',
    start: '2011-05',
    end: '2012-06',
    platform: 'Web',
    clients: ['UEFA'],
    summary: 'Led and project-managed the UEFA Legacy website.',
    highlights: [
      'Led development and project-managed the UEFA Legacy Flash website, coordinating stakeholders and technical teams.',
      'Its successful delivery secured a contract extension with UEFA at a very uncertain time for the company.',
      'Led a team of 3–4 engineers and mentored junior developers.',
    ],
    caseStudy: 'uefa-legacy',
    onCv: true,
  },
  {
    id: 'flash',
    title: 'Flash/AS3 Developer',
    company: 'UIC Digital',
    start: '2010-10',
    end: '2011-04',
    platform: 'Web',
    clients: ['UEFA', 'Amazon'],
    summary: 'Built web video-editing tools for enterprise clients.',
    highlights: [
      'Developed Flash-based and web video-editing tools for enterprise clients including UEFA and Amazon.',
      'Worked on site at Amazon, helping its engineering teams diagnose and fix issues in an existing Flash media player.',
    ],
    onCv: false,
  },
  {
    id: 'army',
    title: 'Operator of PC Workstations and Cryptographic Machines',
    company: 'Greek Army (national service)',
    start: '2008-11',
    end: '2009-10',
    platform: 'Other',
    clients: [],
    summary: 'Ran secure communication systems during national service.',
    highlights: [
      'Administered specialised communication and cryptographic systems in a high-security environment.',
      'Directed call-centre operations during assigned shifts and supervised personnel.',
    ],
    onCv: false,
  },
  {
    id: 'web-well',
    title: 'Junior Flash/AS3 Developer',
    company: 'The Web Well',
    start: '2007-10',
    end: '2008-09',
    platform: 'Web',
    clients: [],
    summary: 'First role: Flash sites for London venues.',
    highlights: [
      'Developed Flash and ActionScript 3 sites for London venues including The Club at The Ivy and Supper Club.',
      'Contributed to Flash and Flex projects from concept to delivery, with functional and technical documentation.',
    ],
    onCv: false,
  },
];

export type Client = { name: string; platforms: Platform[]; hue: number };

/** Client name tiles. Hues are decorative only; no brand colours or logos are used. */
export const clients: Client[] = [
  { name: 'BBC', platforms: ['Roku'], hue: 340 },
  { name: 'Channel 5', platforms: ['Roku'], hue: 300 },
  { name: 'ESPN', platforms: ['PlayStation'], hue: 25 },
  { name: 'Showtime', platforms: ['Roku', 'Windows'], hue: 200 },
  { name: 'Crackle', platforms: ['Roku'], hue: 60 },
  { name: 'Univision', platforms: ['Roku'], hue: 270 },
  { name: 'CBS', platforms: ['PlayStation', 'Windows'], hue: 230 },
  { name: 'NHL', platforms: ['PlayStation'], hue: 160 },
  { name: 'WWE', platforms: ['PlayStation', 'Windows'], hue: 10 },
  { name: 'UEFA', platforms: ['Web'], hue: 250 },
  { name: 'Camelot', platforms: ['Windows'], hue: 140 },
  { name: 'HowStuffWorks', platforms: ['Windows'], hue: 190 },
  { name: 'Amazon', platforms: ['Web'], hue: 80 },
];

export type SkillGroup = { name: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    name: 'Roku',
    items: ['BrightScript', 'SceneGraph', 'BrighterScript', 'Roku SDK', 'Roku certification', 'App deployment', 'MVVM architecture', 'Reusable UI components'],
  },
  {
    name: 'Features & integrations',
    items: ['Roku Advertising Framework (RAF)', 'EPG / TV guide', 'Parental controls / PIN', 'Deep linking', 'Google Analytics', 'Adobe Analytics'],
  },
  {
    name: 'Streaming',
    items: ['HLS', 'DASH', 'DRM: Widevine, PlayReady', 'VOD', 'Live TV'],
  },
  {
    name: 'Performance & testing',
    items: ['Load-time profiling', 'Memory profiling', 'RALE', 'Roku Resource Monitor', 'Static Channel Analysis', 'Deep Linking Tester', 'Rooibos unit tests'],
  },
  {
    name: 'Other platforms',
    items: ['Apple TVML/TVJS', 'PlayStation (Sony Trilithium)', 'Windows / UWP / Xbox', 'C# / .NET', 'XAML', 'JavaScript', 'React.js & Next.js', 'HTML5 & CSS', 'XML & JSON', 'SQL Server, MySQL, SQLite', 'Microsoft Azure'],
  },
  {
    name: 'Tools & ways of working',
    items: ['Git, GitHub, GitLab', 'Jenkins CI/CD', 'Charles Proxy & Fiddler', 'Postman', 'VS Code & Cursor', 'Claude Code (skills, subagents)', 'GitHub Copilot', 'Agile / Scrum', 'Code review', 'SOLID · KISS · YAGNI · DRY'],
  },
];

export const education = [
  {
    degree: 'MSc Software Engineering',
    detail: 'Commendation (2:1)',
    school: 'Kingston University',
    year: '2010',
    dissertation: "Doctor's Game",
  },
  {
    degree: 'BSc Informatics (Computer Science)',
    detail: '',
    school: 'University of Piraeus',
    year: '2005',
    dissertation: 'Contemporaneous Algorithms of Optimization',
  },
];

export const certifications: { name: string; issuer: string; date: string; url?: string }[] = [
  {
    name: 'Introduction to agent skills',
    issuer: 'Anthropic',
    date: 'May 2026',
    url: 'https://verify.skilljar.com/c/8bttmhi2q6on',
  },
  { name: 'Become a ReactJS developer in 30 days', issuer: 'Udemy', date: 'Oct 2025' },
  { name: 'Frontend web developer: modern HTML, CSS, JavaScript', issuer: 'Udemy', date: 'Sep 2025' },
];

export const volunteering = [
  {
    role: 'Volunteer, food and goods distribution',
    org: 'Ilion borough, Athens',
    year: '1999',
    detail: 'Supplied food and goods to people living in tents after the 1999 Athens earthquake.',
  },
];

export type Recommendation = {
  name: string;
  role: string;
  relationship: string;
  date: string;
  /** A short pull-quote; the full text stays on LinkedIn. */
  quote: string;
  hue: number;
};

/** LinkedIn recommendations. Full texts: profile.recommendationsUrl */
export const recommendations: Recommendation[] = [
  {
    name: 'Kalem Fletcher',
    role: 'Chairman, UI Centric',
    relationship: 'Managed Manos directly',
    date: 'Dec 2025',
    quote: 'A rock in an industry that has its fair share of pebbles.',
    hue: 300,
  },
  {
    name: 'Dan Ulzhoefer',
    role: 'Independent Board Advisor & Investor, Clear North',
    relationship: 'Managed Manos directly',
    date: 'Nov 2025',
    quote: 'Someone the team could fully depend on to deliver.',
    hue: 220,
  },
  {
    name: 'Ronan Shortall',
    role: 'Tech Lead & Lead iOS Developer, UIC Digital',
    relationship: 'Worked with Manos on the same team',
    date: 'Nov 2025',
    quote: 'Extremely hard-working and meticulous, but still approachable.',
    hue: 30,
  },
];

export const languages = [
  { name: 'English', level: 'Fluent' },
  { name: 'Greek', level: 'Native' },
];

/* ---------- helpers ---------- */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatMonth(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

export function formatPeriod(role: Pick<Role, 'start' | 'end'>): string {
  return `${formatMonth(role.start)} – ${role.end ? formatMonth(role.end) : 'Present'}`;
}

/** Compact years for card art, e.g. "2020–23" or "2026–now". */
export function shortYears(role: Pick<Role, 'start' | 'end'>): string {
  const s = role.start.slice(0, 4);
  if (!role.end) return `${s}–now`;
  const e = role.end.slice(0, 4);
  return s === e ? s : `${s}–${e.slice(2)}`;
}
