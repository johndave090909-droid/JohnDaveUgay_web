// Principles under [how i work].

export interface Principle {
  id: string;
  num: string;
  title: string;
  body: string;
}

export const principles: Principle[] = [
  {
    id: 'start-at-the-counter',
    num: '01',
    title: 'Start at the counter, not the keyboard',
    body:
      'Every system I have shipped began with sitting next to the person who will use it: a chef who prints the prep list, a manager who re-keys timesheets, a director who reads the Monday report. I write down what they do today, build the smallest version that removes one step, demo it and adjust. Modules earn their place by being used.',
  },
  {
    id: 'check-the-detail',
    num: '02',
    title: 'Check the detail behind every total',
    body:
      'A 3.5% food-cost forecast gap looked fine until an AI-assisted scan found 198 of 203 recipe-card ingredient lines wrong, with errors in both directions cancelling out. Helping plan the fix taught me not to trust a good total. Since then every report I send validates its inputs first, and every live dashboard raises an alert when a source changes format or goes stale.',
  },
  {
    id: 'keep-the-habit',
    num: '03',
    title: 'Replace the spreadsheet, keep the habit',
    body:
      'People trust the tools they already know. The booking console syncs to Google Sheets, and staff profiles sync from the sheet the office already maintains. The new system has to be easier than the old one on day one.',
  },
  {
    id: 'run-it-like-production',
    num: '04',
    title: 'Run it like production',
    body:
      'Internal does not mean casual. 17 permission roles live in database security rules, API keys stay server-side, a separate test environment runs on live data, parsers have unit tests, and a second developer’s pull requests are reviewed before deploy.',
  },
  {
    id: 'ai-assisted',
    num: '05',
    title: 'AI-assisted development, human-owned decisions',
    body:
      'I build with Claude Code and Codex every day, which is how one person can ship 25+ modules in a year. The tools write a lot of the code. I decide what gets built, read what they produce, test it against real data and answer for it when it breaks.',
  },
  {
    id: 'measure',
    num: '06',
    title: 'Measure before and after',
    body:
      'The labor forecast back-tests at 4.5% mean error, and a headcount-based method took the payroll estimate gap from −29% to +4.7%. If I cannot put a number on the before and the after, I have not finished.',
  },
];

export const toolkit: { group: string; items: string }[] = [
  { group: 'Build', items: 'TypeScript, React, Next.js, Node.js, Python, Excel/VBA, Google Apps Script' },
  { group: 'Run', items: 'Firebase, Google Cloud, AWS (EC2), Vercel, Git/GitHub, Vitest, Playwright' },
  { group: 'AI', items: 'Claude and Gemini APIs, Claude Code, Codex, Ollama, Whisper, PyTorch' },
  { group: 'Analyse', items: 'Power BI, Tableau, forecasting, cost and variance analysis, KPI scorecards (EOS)' },
  { group: 'Make', items: 'DaVinci Resolve, Premiere Pro, After Effects, Remotion, Blender' },
];
