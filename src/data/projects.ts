// Projects on the Projects page, in this order; each one also gets a page of its own.
// To add a screenshot, drop a file in public/projects/ and set `image: { src: '/projects/<file>', alt: '...' }`.
// For a clip, add `video: '/projects/<file>.mp4'` too; `src` is then its still.

export type ProjectTag = 'ops' | 'web' | 'ai' | 'data' | 'motion' | 'security';

export interface ProjectLink {
  label: string;
  url: string;
  /** A working site or the work in use. Live links are also listed on the Contact page and mark the project's card. */
  live?: boolean;
}

export interface Project {
  id: string;
  /** Short code printed on the generated thumbnail. */
  code: string;
  title: string;
  /** Right-hand title in the index list. A newline splits it over two lines. */
  kicker: string;
  org: string;
  year: string;
  tags: ProjectTag[];
  stack: string[];
  summary: string;
  highlights: string[];
  links?: ProjectLink[];
  /** id of a case study under [case studies], if one exists. */
  caseStudy?: string;
  /** Headline figure shown on the thumbnail. */
  stat?: string;
  /** Screenshot used for the index card and the project entry, in place of the generated thumbnail. */
  image?: ProjectImage;
}

export interface ProjectImage {
  src: string;
  alt: string;
  /** CSS object-position for the crop, e.g. 'left top'. Defaults to centred. */
  position?: string;
  /** A muted clip that plays in the project's entry, with `src` as its still. The index card keeps the still. */
  video?: string;
}

export const PROJECT_TAGS: { id: ProjectTag | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ops', label: 'Operations' },
  { id: 'web', label: 'Web apps' },
  { id: 'ai', label: 'AI' },
  { id: 'data', label: 'Data' },
  { id: 'motion', label: 'Motion' },
  { id: 'security', label: 'Security' },
];

export const tagLabel = (t: ProjectTag) => PROJECT_TAGS.find((x) => x.id === t)?.label ?? t;

export const projects: Project[] = [
  {
    id: 'command-center',
    code: 'CCC',
    title: 'Culinary Command Center',
    kicker: 'Internal platform /\nReact · Firebase',
    org: 'Polynesian Cultural Center',
    year: '2025 – now',
    tags: ['ops', 'web', 'ai'],
    stack: [
      'TypeScript',
      'React',
      'Firebase (Firestore, Auth, Storage, Cloud Functions)',
      'Google Cloud Secret Manager',
      'Claude API',
    ],
    stat: '25+ modules',
    image: {
      src: '/projects/command-center-home.webp',
      alt: 'Culinary Command Center home page: the department’s motto, vision and mission, a menu of its systems, and a team summary; staff names and announcements blurred',
      position: 'left top',
    },
    summary:
      'The web platform a 90-person culinary department runs on across 3 venues. It started as one automation and grew into 25+ modules: team messaging, projects, live guest counts, shift scheduling, training sign-off and reporting. It replaced spreadsheets, paper forms and emailed PDFs.',
    highlights: [
      '640+ commits and ~70k lines of TypeScript; 35+ Cloud Functions.',
      '17 permission roles enforced in database security rules; API keys kept server-side.',
      'LLM features in production: Claude turns a photo of a student’s class schedule into scheduler entries.',
      'Includes MissionBoard, the department’s work board with KPIs and live process maps, written up as a project of its own.',
      'A separate test environment loaded with live data, unit tests on the data parsers, and pull-request review for a second developer.',
      'Built with AI-assisted development (Claude Code, Codex). I make the product decisions and own the result.',
    ],
    caseStudy: 'command-center',
  },
  {
    id: 'missionboard',
    code: 'MSN',
    title: 'MissionBoard, mission control for culinary operations',
    kicker: 'Work management /\nKPIs · process maps',
    org: 'Polynesian Cultural Center',
    year: '2026',
    tags: ['ops', 'web'],
    stack: ['React', 'Firebase (Firestore, Auth)', 'Firestore security rules', 'Vitest'],
    stat: 'live KPIs',
    image: {
      src: '/projects/missionboard.webp',
      alt: 'MissionBoard project board for the PCC Culinary workspace: columns of in-progress cards, staff names blurred',
      position: 'left top',
    },
    summary:
      'The department’s work board, built into the Culinary Command Center. Projects live as cards on shared boards, each board tracks its own daily, weekly and monthly KPIs beside the work, and teams draw their processes as shared, live diagrams. The Culinary Director gets one view of everyone’s workload and how much is landing on time.',
    highlights: [
      'Board, calendar, timeline, dashboard and archive views of the same cards. Every change shows up live for everyone on the board.',
      'KPIs beside each board: daily, weekly or monthly goal cards with up to ten goals each (numbers, percentages, money or yes/no), met when every goal is.',
      'Process maps: a diagram editor where two people can work on the same map at once and their edits merge shape by shape, so nobody loses work.',
      'Bulk add: paste a list from a spreadsheet or a chat summary and it becomes cards, with owners matched to board members and every row checked before it is saved.',
      'Team workload and a completion dashboard for the Director, worked out by fixed, tested rules rather than AI, so every number traces back to the cards behind it.',
      'About 13,700 lines across 15 modules, with unit tests on the KPI, bulk-add and dashboard logic.',
    ],
    caseStudy: 'command-center',
  },
  {
    id: 'labor-report',
    code: 'LBR',
    title: 'Labor report & forecast',
    kicker: 'Automation · forecasting /\nPower BI · UKG',
    org: 'Polynesian Cultural Center',
    year: '2025 – now',
    tags: ['ops', 'data'],
    stack: ['Cloud Functions', 'Node.js', 'React', 'Firebase', 'Power BI exports', 'UKG timesheets', 'Forecasting'],
    stat: '~6,500 guests / wk',
    image: {
      src: '/projects/labor-report.webp',
      alt: 'Command Center Labor Report: last week’s actual labor cost per guest by day beside this week’s live forecast from bookings and the roster; dollar figures blurred',
      position: 'left top',
    },
    summary:
      'One page in the Command Center for labor cost per guest, looking back and looking ahead. Every Monday it merges guest counts from Power BI and timesheets from UKG for ~6,500 guests and ~1,650 labor hours, checks the data and emails last week’s labor cost per guest against target to leadership. Beside it, a live forecast projects the current week from bookings and the roster as each day is counted.',
    highlights: [
      'Validates the join before anything is sent, so a bad week never looks like a good one.',
      'Replaced a manual spreadsheet merge that used to take a morning.',
      'This week’s cost per guest updates as each day is counted: guests from bookings at the expected scan rate, hours estimated from the roster.',
      'The seasonal labor-cost forecast back-tests at 4.5% mean error.',
      'A headcount-based method cut the payroll estimate gap from −29% to +4.7%.',
    ],
    caseStudy: 'data-pipelines',
  },
  {
    id: 'kpi-live',
    code: 'KPI',
    title: 'Daily KPI scorecard & live guest counts',
    kicker: 'Automation /\nPower Automate · PDF parsing',
    org: 'Polynesian Cultural Center',
    year: '2025',
    tags: ['ops', 'data', 'web'],
    stack: ['Microsoft Power Automate', 'My own n8n-inspired automation', 'Cloud Functions', 'PDF parsing', 'Firestore', 'React'],
    stat: 'every 5 min',
    image: {
      src: '/projects/live-guest-count.webp',
      alt: 'Live Guest Count slide on the kitchen screens: total guests, then the Aloha Luau, Hale Ohana Luau and Gateway Buffet counts with each venue’s share (example numbers)',
    },
    summary:
      'A 31-measure daily scorecard and live guest counts refreshed every 5 minutes on 4 screens. The live count is pulled by a combination of Microsoft Power Automate and an n8n-inspired automation I built myself. Both feeds are parsed from PDF reports, with alerts when a format changes or the data goes stale. 93 staff profiles synced from Google Sheets.',
    highlights: [
      'Live guest count pulled with Microsoft Power Automate plus my own n8n-inspired automation, built from scratch, so a new count reaches the screens every 5 minutes.',
      '31 measurables on the daily scorecard (EOS-style).',
      'Alerts on format changes and stale data, so wrong numbers never pass as right ones.',
      '17 permission roles decide who sees what.',
    ],
    caseStudy: 'data-pipelines',
  },
  {
    id: 'recipe-audit',
    code: 'RCP',
    title: 'Fixing a hidden recipe-cost variance',
    kicker: 'Cost analysis /\nfood cost',
    org: 'Polynesian Cultural Center',
    year: '2026',
    tags: ['ops', 'data'],
    stack: ['Variance analysis', 'Food-cost planning'],
    stat: '198 / 203',
    // Generated illustration (scratchpad gc/make_variance.py): per-line bars are made up; only the totals are real.
    image: {
      src: '/projects/recipe-variance.webp',
      alt: 'Illustration, not real data: 203 ingredient lines as bars, costed too high above zero and too low below, cancelling out to a small +3.5% net gap beside a 28% average line error',
    },
    summary:
      'An AI-assisted scan found costing errors on 198 of 203 recipe-card ingredient lines. The food-cost forecast was only 3.5% off in total, but that small gap was hiding a 28% variance at the line level. I helped plan how to respond and how to eliminate the variance, and explained it all to the managers, the Culinary Director and R&D.',
    highlights: [
      'Helped plan how to proceed once the errors were found.',
      'Helped plan the fix: a 60-day recipe-correction sprint, and a next-day ordering pilot because warehouse deliveries arrive after prep starts.',
      'Explained carefully to the managers, the Culinary Director and R&D why a 3.5% total could look fine while individual lines were far off: errors in both directions were cancelling each other out.',
    ],
    caseStudy: 'recipe-audit',
  },
  {
    id: 'inventory-verification',
    code: 'INV',
    title: 'Inventory verification for transfer orders',
    kicker: 'Command Center module /\nReact · Firebase',
    org: 'Polynesian Cultural Center',
    year: '2026',
    tags: ['ops', 'web'],
    stack: ['TypeScript', 'React', 'Firebase (Firestore)', 'SheetJS', 'Vitest'],
    stat: 'sheet → checklist',
    image: {
      src: '/projects/inventory-verification.webp',
      alt: 'Inventory Verification checklist for a retail transfer order: 0 of 96 items checked, each line with its item number, quantity and unit, with search and filters; the uploader’s name blurred',
      position: 'left top',
    },
    summary:
      'A Command Center module for checking deliveries against transfer orders. Upload the order spreadsheet and its lines become a checklist with item numbers, quantities and units. Staff tick each line as they count and note anything that is off, and any count can be picked up and finished by someone else.',
    highlights: [
      'Reads whatever the ordering system exports: columns are found by their headings, not their positions, so title rows above the table do not break it. The file is read in the browser and never stored.',
      'Every upload, tick and note is saved the moment it happens, so a count survives a dropped phone and can be finished on another device. Each device offers to continue where it left off.',
      'Search, plus To check, Checked and With notes filters, to find a line fast on the floor.',
      'Finished counts are kept by month with a search box, each with an activity list: the upload, every tick and note, and who completed it.',
      'Behind its own permission and security rules, with the spreadsheet parsing unit-tested against a real export.',
    ],
  },
  {
    id: 'jarvis',
    code: 'JVS',
    title: 'Jarvis, a hands-free voice assistant',
    kicker: 'Local AI /\nWhisper · Ollama · Kokoro',
    org: 'Personal',
    year: '2026',
    tags: ['ai'],
    stack: ['Python', 'Whisper', 'Ollama (Qwen3 8B)', 'Kokoro TTS', 'openWakeWord', 'livekit-wakeword', 'Claude Code'],
    stat: 'runs on my desk',
    image: {
      src: '/projects/jarvis.webp',
      alt: 'Jarvis’s on-screen orb in its four states: a dim blue dot asleep, a bright blue orb with ripples listening, an orange orb with rotating arcs thinking, and a pale blue orb with ripples speaking',
    },
    summary:
      'Say “Jarvis” and ask for anything in your own words. Speech recognition, the language model and the voice all run on my own Windows PC: Whisper listens, a local Qwen3 8B model thinks through Ollama, and Kokoro speaks on the GPU. Nothing leaves the machine unless I ask it to.',
    highlights: [
      'A custom wake word trained on my own voice with livekit-wakeword, scored through openWakeWord’s feature models. A hotkey works too.',
      'An always-on-top orb shows whether it is asleep, listening, thinking or speaking. Clicks pass through it, and it hides over full-screen apps.',
      'Tools the model can call: desktop actions, web search, weather, a morning briefing, reminders that survive restarts, and long-term memory kept in plain text files I can edit in Notepad.',
      'When a request needs a terminal command, Claude writes it, I approve it with a click, and Jarvis runs it and reads back the result.',
    ],
  },
  {
    id: 'jd-assistant',
    code: 'JDA',
    title: 'JD Assistant, a two-brain agent',
    kicker: 'Local AI /\nNode.js · Claude · Ollama',
    org: 'Personal',
    year: '2025 – 2026',
    tags: ['ai', 'web'],
    stack: ['Node.js', 'Claude API', 'Ollama (Qwen3 8B)', 'streaming UI'],
    stat: '2 brains',
    image: {
      src: '/projects/jd-assistant.webp',
      alt: 'JD Assistant chat on the local Qwen3 8B model: asked to save a Manila packing note and tell the time, it shows a “Writing file” and a “Checking the time” step, then answers',
      position: 'center top',
    },
    summary:
      'A chat page that can do things, not just answer: search the web, check the time, and read, write and delete files in its workspace. A dropdown switches the brain between the Claude API and a local Qwen3 8B model, and the same tools work with both.',
    highlights: [
      'The agent loop is about 40 lines: ask the model, run the tools it asks for, hand back the results, repeat until it answers.',
      'One provider interface for two very different APIs. The Ollama provider translates between Anthropic’s message format and the OpenAI-style dialect, so it also works with LM Studio, llama.cpp or vLLM.',
      'File tools are sandboxed to one workspace folder. The chat shows a chip for each tool call and a collapsible thought process.',
    ],
  },
  {
    id: 'interiorgen',
    code: 'IGA',
    title: 'InteriorGen AI',
    kicker: 'Prompt to 3D /\nReact · Express · Meshy',
    org: 'Personal',
    year: '2026',
    tags: ['ai', 'web'],
    stack: ['React', 'Express', 'Firebase (Auth, Firestore, Storage)', 'Meshy API', 'model-viewer'],
    stat: 'prompt → 3D',
    image: {
      src: '/projects/interiorgen.webp',
      alt: 'InteriorGen AI home page: “AI Interior Design Model Generator”, with Start Generating and Text to 3D or Image to 3D options',
      position: 'center top',
    },
    summary:
      'Turns a text prompt or a photo into a textured 3D furniture model, with an in-browser 3D viewer, OBJ/FBX/GLB export, Google sign-in and per-user history.',
    highlights: [
      'Text-to-3D and image-to-3D through the Meshy API, with the Express server keeping the key off the client.',
      'Models are viewable in the browser and downloadable in the formats Blender and game engines expect.',
    ],
  },
  {
    id: 'minecraft-bots',
    code: 'MCB',
    title: 'Three AI bots on a Minecraft server',
    kicker: 'Agents /\nMineflayer · Node.js',
    org: 'Personal',
    year: '2026',
    tags: ['ai'],
    stack: ['Node.js', 'Mineflayer', 'Claude Code', 'Codex', 'Ollama (Andy 9B)', 'HTTP API'],
    stat: '3 bots',
    summary:
      'Three helper bots on a Fabric server my friends play on. One body script with every skill (chop, mine, farm, build, follow, give), three different brains: Claude Code, Codex, and a local 9B model that answers players on its own so nobody has to be at the PC.',
    highlights: [
      'Players talk to a bot by name in chat; a bridge hands each request to the right agent and the reply comes back in game.',
      'A CLI drives each bot through a local HTTP API. Repeating work is written as self-looping jobs, not as an agent polling.',
      'Protected zones so no bot digs a build, and shared handoff notes so Claude Code and Codex can take over from each other mid-task.',
    ],
  },
  {
    id: 'taste-polynesia',
    code: 'TPM',
    title: 'Taste Polynesia digital menu',
    kicker: 'React · WebCodecs /\nGemini · 3D',
    org: 'Polynesian Cultural Center',
    year: '2026',
    tags: ['web', 'ai', 'motion'],
    stack: ['React', 'WebCodecs', 'Gemini API', 'ComfyUI', 'TRELLIS.2', 'model-viewer'],
    stat: '10 3D dishes',
    summary:
      'Annotated “exploded view” dish videos for a digital menu, a browser-based video editor so staff can produce them, and a photo-to-3D pipeline that produced 10 web-ready 3D dish models in a pilot.',
    highlights: [
      'Video is cut and annotated in the browser with WebCodecs; no desktop editor needed.',
      'Photo-to-3D pipeline built on ComfyUI and TRELLIS.2, exported for the web.',
    ],
    links: [{ label: 'Live site', url: 'https://pccculinary.com/taste-polynesia', live: true }],
  },
  {
    id: 'car-rental',
    code: 'FLT',
    title: 'Fleet & booking console',
    kicker: 'Client work /\nNathanWORKS',
    org: 'Car-rental company, Iligan City, Philippines',
    year: '2026',
    tags: ['web', 'ops'],
    stack: ['TypeScript', 'React', 'Google Sheets sync'],
    stat: '0 double bookings',
    summary:
      'A booking and fleet console for a car-rental company in Iligan City. It prevents double bookings and syncs to the Google Sheet the owner already runs the business from, so nothing had to change on their side.',
    highlights: ['Scoped, built and handed over end to end.', 'Google Sheets stays the system of record the owner knows.'],
  },
  {
    id: 'wedding-rsvp',
    code: 'RSV',
    title: 'Wedding RSVP site',
    kicker: 'Client work /\nReact · Firebase',
    org: 'NathanWORKS',
    year: '2026',
    tags: ['web'],
    stack: ['React', 'Firebase', 'Tailwind', 'Vite'],
    stat: '1 big day',
    image: {
      src: '/projects/wedding-rsvp.webp',
      alt: 'Save-the-date envelope surrounded by flowers and polaroid photos of the couple',
    },
    summary:
      'A wedding website with RSVP collection, built for a couple as a client project: guests respond on their phones and the couple sees the list update live.',
    highlights: ['RSVPs stored in Firestore and visible to the couple in real time.'],
    links: [{ label: 'Live site', url: 'https://ayden-katriel.web.app/', live: true }],
  },
  {
    id: 'photographer-site',
    code: 'PHO',
    title: 'Self-editable photographer’s website',
    kicker: 'Client work /\nNathanWORKS',
    org: 'NathanWORKS',
    year: '2026',
    tags: ['web'],
    stack: ['React', 'Firebase'],
    stat: 'no dev needed',
    image: {
      src: '/projects/photographer-site.webp',
      alt: 'Photographer’s homepage with the headline “Quiet, honest imagery for the ones you love” over a couple walking by the water',
      position: 'center top',
    },
    summary:
      'A portfolio site the client updates in place, without a developer: galleries and text are edited on the page itself.',
    highlights: ['Built so the handover is the last time the client needs me.'],
    links: [{ label: 'Live site', url: 'https://keizha-co.web.app/', live: true }],
  },
  {
    id: 'remote-sensing',
    code: 'SAT',
    title: 'Satellite remote sensing',
    kicker: 'Python · PyTorch /\nEarth Engine',
    org: 'Personal',
    year: '2026',
    tags: ['ai', 'data'],
    stack: ['Python', 'PyTorch', 'Segment Anything', 'Google Earth Engine', 'Sentinel-2'],
    stat: '7 GEE scripts',
    summary:
      'A Sentinel-2 pipeline with SAM segmentation and 7 Earth Engine scripts mapping seagrass, water and wildfire at Philippine coastal sites.',
    highlights: ['Coastal sites in the Philippines, where I plan to work after graduation.'],
  },
  {
    id: 'motion',
    code: 'MOT',
    title: 'Motion graphics in code',
    kicker: 'Remotion · rembg /\nffmpeg',
    org: 'Personal · client',
    year: '2026',
    tags: ['motion'],
    stack: ['Remotion', 'React', 'rembg', 'ffmpeg', 'VP9 alpha'],
    stat: '60-frame loop',
    image: {
      src: '/projects/motion-logo.webp',
      video: '/projects/motion-logo.mp4',
      alt: 'Logo sting for Polynesian Cultural Center Culinary: a wok bursts into flame, then the wordmark builds beside it',
    },
    summary:
      'Video built as React. A logo sting where 15 vector paths and ten flame tendrils animate on their own timing, with a seamless 60-frame loop for title cards. A “text behind the subject” clip that uses per-frame segmentation mattes encoded as VP9 with alpha. And nine B-roll explainer clips for a video on open-weight models, sharing one motion grammar so cuts between them feel like one piece.',
    highlights: [
      'Every flame ignites on its own schedule; nothing is a mask over a flat image.',
      'Per-frame mattes from rembg, smoothed over 3 frames so the silhouette does not crawl.',
      'Scenes are editable live in Remotion Studio: drag an element, retime it, and the change writes back to source.',
    ],
    links: [{ label: 'See it in use on Instagram', url: 'https://www.instagram.com/p/DfDro3dgBoj/', live: true }],
  },
  {
    id: 'suricata',
    code: 'IDS',
    title: 'Network intrusion detection lab',
    kicker: 'Suricata 8 /\nPowerShell',
    org: 'Personal',
    year: '2026',
    tags: ['security'],
    stack: ['Suricata 8', 'Emerging Threats rules', 'PowerShell', 'Npcap'],
    stat: '~51,000 rules',
    // Stock photo: "EthernetSwitch.jpg" by Raysonho, Wikimedia Commons, CC0 (no credit required).
    // https://commons.wikimedia.org/wiki/File:EthernetSwitch.jpg
    image: {
      src: '/projects/intrusion-detection.webp',
      alt: 'Close-up of a network switch with blue, yellow and green Ethernet cables plugged into its ports',
      position: 'center top',
    },
    summary:
      'Suricata running natively on Windows against the host’s own traffic: ~51,000 Emerging Threats rules plus my own, PowerShell start/stop tooling and write-ups of what it actually caught.',
    highlights: ['Detection only; nothing is blocked.', 'IoT devices brought into scope through a mobile hotspot.'],
  },
];
