// Projects shown under [projects] on the home page, in this order.
// To add a screenshot, drop a file in public/projects/<id>.jpg and set `image: '/projects/<id>.jpg'`.

export type ProjectTag = 'ops' | 'web' | 'ai' | 'data' | 'motion' | 'security';

export interface ProjectLink {
  label: string;
  url: string;
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
  image?: string;
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
      'Gemini API',
    ],
    stat: '25+ modules',
    summary:
      'The web platform a 90-person culinary department runs on across 3 venues. It started as one automation and grew into 25+ modules: team messaging, projects, live guest counts, shift scheduling, training sign-off and reporting. It replaced spreadsheets, paper forms and emailed PDFs.',
    highlights: [
      '640+ commits and ~70k lines of TypeScript; 35+ Cloud Functions.',
      '17 permission roles enforced in database security rules; API keys kept server-side.',
      'LLM features in production: Claude turns a photo of a student’s class schedule into scheduler entries; Gemini turns each project board into a structured portfolio map.',
      'A separate test environment loaded with live data, unit tests on the data parsers, and pull-request review for a second developer.',
      'Built with AI-assisted development (Claude Code, Codex). I make the product decisions and own the result.',
    ],
    caseStudy: 'command-center',
  },
  {
    id: 'scheduler-forecast',
    code: 'SCH',
    title: 'Auto-scheduler & labor forecast',
    kicker: 'Automation /\nExcel/VBA · Python',
    org: 'Polynesian Cultural Center',
    year: '2025',
    tags: ['ops', 'data'],
    stack: ['Excel/VBA', 'Python', 'forecasting'],
    stat: '31.7% → ~75%',
    summary:
      'A scheduler that fills 77 positions from ~51 student workers inside a 19-hour weekly limit, and a seasonal labor-cost forecast for the same department.',
    highlights: [
      'Shift coverage rose from 31.7% to ~75%, against a maximum possible 76.1% given availability.',
      'Forecast back-tested at 4.5% mean error.',
      'A headcount-based method cut the payroll estimate gap from −29% to +4.7%.',
    ],
    caseStudy: 'scheduler',
  },
  {
    id: 'labor-report',
    code: 'LBR',
    title: 'Weekly labor report',
    kicker: 'Automation /\nPower BI · UKG',
    org: 'Polynesian Cultural Center',
    year: '2025',
    tags: ['ops', 'data'],
    stack: ['Cloud Functions', 'Node.js', 'Power BI exports', 'UKG timesheets', 'email'],
    stat: '~6,500 guests / wk',
    summary:
      'Every Monday it merges guest counts from Power BI and timesheets from UKG for ~6,500 guests and ~1,650 labor hours, checks the data and emails labor cost per guest against target to leadership.',
    highlights: [
      'Validates the join before anything is sent, so a bad week never looks like a good one.',
      'Replaced a manual spreadsheet merge that used to take a morning.',
    ],
    caseStudy: 'data-pipelines',
  },
  {
    id: 'kpi-live',
    code: 'KPI',
    title: 'Daily KPI scorecard & live guest counts',
    kicker: 'Automation /\nPDF parsing',
    org: 'Polynesian Cultural Center',
    year: '2025',
    tags: ['ops', 'data', 'web'],
    stack: ['Cloud Functions', 'PDF parsing', 'Firestore', 'React'],
    stat: 'every 5 min',
    summary:
      'A 31-measure daily scorecard and live guest counts refreshed every 5 minutes on 4 screens, both parsed from PDF reports, with alerts when a format changes or the data goes stale. 93 staff profiles synced from Google Sheets.',
    highlights: [
      '31 measurables on the daily scorecard (EOS-style).',
      'Alerts on format changes and stale data, so wrong numbers never pass as right ones.',
      '17 permission roles decide who sees what.',
    ],
    caseStudy: 'data-pipelines',
  },
  {
    id: 'recipe-audit',
    code: 'RCP',
    title: 'Recipe-card cost audit',
    kicker: 'Cost analysis /\nfood cost',
    org: 'Polynesian Cultural Center',
    year: '2026',
    tags: ['ops', 'data'],
    stack: ['Excel', 'Python', 'variance analysis'],
    stat: '198 / 203',
    summary:
      'Audited costing on 203 recipe-card ingredients and found errors on 198. The forecast was only 3.5% off in total, which was hiding a 28% variance at the line level.',
    highlights: [
      'Separated the small net gap from the large line-level errors that cancelled each other out.',
      'Proposed a 60-day recipe-correction sprint to leadership.',
      'Proposed a next-day ordering pilot, because warehouse deliveries arrive after prep starts.',
    ],
    caseStudy: 'recipe-audit',
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
    summary:
      'Turns a text prompt or a photo into a textured 3D furniture model, with an in-browser 3D viewer, OBJ/FBX/GLB export, Google sign-in and per-user history.',
    highlights: [
      'Text-to-3D and image-to-3D through the Meshy API, with the Express server keeping the key off the client.',
      'Models are viewable in the browser and downloadable in the formats Blender and game engines expect.',
    ],
    links: [{ label: 'Code', url: 'https://github.com/johndave090909-droid/InteriorGen-AI' }],
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
    summary:
      'A wedding website with RSVP collection, built for a couple as a client project: guests respond on their phones and the couple sees the list update live.',
    highlights: ['RSVPs stored in Firestore and visible to the couple in real time.'],
    links: [{ label: 'Code', url: 'https://github.com/johndave090909-droid/KateLamoglia' }],
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
    summary:
      'A portfolio site the client updates in place, without a developer: galleries and text are edited on the page itself.',
    highlights: ['Built so the handover is the last time the client needs me.'],
  },
  {
    id: 'verification-system',
    code: 'VRF',
    title: 'Inventory verification system',
    kicker: 'React · Firebase /\nlive on Vercel',
    org: 'Personal',
    year: '2025',
    tags: ['web', 'ops'],
    stack: ['React', 'Vite', 'Firebase'],
    stat: 'Excel in → checked',
    summary:
      'Import an inventory list from Excel or paste, verify items against it, and hand the session to another device. Sessions sync through Firebase with a local fallback.',
    highlights: ['Deployed and public; the demo link works.'],
    links: [
      { label: 'Live', url: 'https://verification-system-three.vercel.app' },
      { label: 'Code', url: 'https://github.com/johndave090909-droid/Verification-System' },
    ],
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
    summary:
      'Video built as React. A logo sting where 15 vector paths and ten flame tendrils animate on their own timing, with a seamless 60-frame loop for title cards. A “text behind the subject” clip that uses per-frame segmentation mattes encoded as VP9 with alpha. And nine B-roll explainer clips for a video on open-weight models, sharing one motion grammar so cuts between them feel like one piece.',
    highlights: [
      'Every flame ignites on its own schedule; nothing is a mask over a flat image.',
      'Per-frame mattes from rembg, smoothed over 3 frames so the silhouette does not crawl.',
      'Scenes are editable live in Remotion Studio: drag an element, retime it, and the change writes back to source.',
    ],
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
    summary:
      'Suricata running natively on Windows against the host’s own traffic: ~51,000 Emerging Threats rules plus my own, PowerShell start/stop tooling and write-ups of what it actually caught.',
    highlights: ['Detection only; nothing is blocked.', 'IoT devices brought into scope through a mobile hotspot.'],
  },
];
