// Long-form write-ups under [case studies]. Each one is linked from its project.

export interface CaseStudy {
  id: string;
  title: string;
  kicker: string;
  org: string;
  year: string;
  /** Headline number and what it means. */
  metric: { value: string; label: string };
  context: string;
  problem: string;
  approach: string[];
  result: string[];
  learned: string;
  stack: string[];
  /** Project ids this write-up belongs to. */
  projects: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'command-center',
    title: 'Replacing paper, spreadsheets and PDFs with one platform',
    kicker: 'Culinary Command Center',
    org: 'Polynesian Cultural Center',
    year: '2025 – now',
    metric: { value: '25+', label: 'modules in production across 3 venues' },
    context:
      'The Polynesian Cultural Center’s culinary department feeds guests across three venues with about 90 staff, many of them student workers on 19-hour weekly limits. When I joined in late 2024 the department ran on spreadsheets, paper forms and PDFs emailed around each morning.',
    problem:
      'Each report lived in someone’s inbox. Guest counts arrived as PDFs, timesheets lived in UKG, schedules in Excel and training records on paper. Nothing was joined, so a question like “what did labor cost per guest last week” took a morning to answer.',
    approach: [
      'Started with one automation, the Monday labor report, and shipped it before touching anything else. Once leadership trusted that, each new module replaced one more paper or spreadsheet process.',
      'Gathered needs directly from chefs, managers and the Culinary Director, demoed working versions and shipped in small steps instead of presenting plans.',
      'React and TypeScript on Firebase: Firestore, Auth, Storage and 35+ Cloud Functions. 17 permission roles enforced in security rules; API keys server-side in Secret Manager.',
      'Ran it as production software: a separate test environment loaded with live data, unit tests on the PDF and data parsers, and pull-request review for a second developer who joined the project.',
      'Shipped LLM features only where they removed a real step. Claude reads a photo of a student’s class schedule into scheduler entries. The Director’s workload and completion views are the opposite: fixed, tested rules, so every number traces back to a card.',
      'Built with AI-assisted development (Claude Code, Codex), which is how one person ships this much. I make the product decisions, read what the tools produce, test against real data and answer for it.',
    ],
    result: [
      '25+ modules in daily use: team messaging, projects, live guest counts, shift scheduling, training sign-off and reporting.',
      '640+ commits, ~70k lines of TypeScript, 35+ Cloud Functions.',
      'Spreadsheets, paper forms and emailed PDFs retired across 3 venues.',
      'Promoted within six months of starting.',
    ],
    learned:
      'Internal tools die when they are harder than the thing they replace. The modules that stuck were the ones that saved someone a step on day one. The ones that needed training sat unused until I simplified them.',
    stack: ['TypeScript', 'React', 'Firebase', 'Cloud Functions', 'Secret Manager', 'Claude API'],
    projects: ['command-center', 'missionboard', 'kpi-live', 'labor-report'],
  },
  {
    id: 'recipe-audit',
    title: 'A 3.5% forecast gap that was hiding a 28% variance',
    kicker: 'Recipe-cost variance',
    org: 'Polynesian Cultural Center',
    year: '2026',
    metric: { value: '198 / 203', label: 'recipe-card ingredient lines with costing errors' },
    context:
      'Food cost is forecast from recipe cards. Every dish lists its ingredients, quantities and unit costs, and the forecast rolls them up against expected guest counts.',
    problem:
      'The forecast was 3.5% off in total, which looked acceptable. Then an AI-assisted scan found costing errors on 198 of 203 recipe-card ingredient lines. The small total was hiding a 28% variance, because large errors in both directions were cancelling each other out.',
    approach: [
      'Helped plan how to proceed once the errors were found.',
      'Helped put together the plan to eliminate the variance: a 60-day recipe-correction sprint for the cards, and a next-day ordering pilot, because warehouse deliveries arrive after prep has started and push the kitchen into substitutions the cards never see.',
      'Explained the findings and the plan carefully to the managers, the Culinary Director and R&D, including why a 3.5% total could look fine while individual lines were far off.',
    ],
    result: [
      'Errors on 198 of 203 lines; the 3.5% net gap was hiding a 28% line-level variance.',
      'A plan to eliminate the variance, a 60-day recipe-correction sprint and a next-day ordering pilot, presented to the managers, the Culinary Director and R&D.',
    ],
    learned:
      'A good total can hide bad parts. Every report I have built since validates its inputs before anyone sees the sum.',
    stack: ['Variance analysis', 'Food-cost planning'],
    projects: ['recipe-audit'],
  },
  {
    id: 'data-pipelines',
    title: 'Reports that validate themselves before anyone reads them',
    kicker: 'Weekly labor report, daily scorecard, live guest counts',
    org: 'Polynesian Cultural Center',
    year: '2025',
    metric: { value: 'every 5 min', label: 'live guest counts on 4 screens, plus a 31-measure daily scorecard' },
    context:
      'Leadership runs on a few numbers: guests served, labor hours, labor cost per guest and a daily scorecard of 31 measurables. The sources are a Power BI export, UKG timesheets and PDF reports from other departments.',
    problem:
      'The numbers were assembled by hand every Monday and every morning. PDFs changed format without warning, and a stale report looked exactly like a fresh one.',
    approach: [
      'Weekly: a Cloud Function merges Power BI guest counts with UKG timesheets (~6,500 guests and ~1,650 hours a week), validates the join and emails labor cost per guest against target.',
      'Daily: parsers read the PDF reports into the 31-measure scorecard, and live guest counts refresh every 5 minutes on 4 screens. The live count is pulled by a combination of Microsoft Power Automate and an n8n-inspired automation I built myself.',
      'Every parser checks the format it expects and raises an alert when a report changes or data goes stale, so a wrong number never looks like a right one.',
      '93 staff profiles sync from the Google Sheet the office already maintains, so their workflow did not change.',
    ],
    result: [
      'The Monday report sends itself, validated.',
      '4 screens of live counts and a daily 31-measure scorecard, with stale-data alerts.',
    ],
    learned:
      'The failure mode of automation is silent wrongness. Alerts on format and freshness are the feature, not an extra.',
    stack: ['Cloud Functions', 'Node.js', 'PDF parsing', 'Microsoft Power Automate', 'Power BI', 'UKG', 'Google Sheets'],
    projects: ['labor-report', 'kpi-live'],
  },
];
