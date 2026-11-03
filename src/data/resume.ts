// Resume content under [resume]. Keep this in step with the PDF in public/resume/.

export const RESUME_PDF = '/resume/Resume_JohnDaveUgay.pdf';

export interface ResumeRole {
  org: string;
  place: string;
  title: string;
  dates: string;
  bullets: string[];
}

export const resume = {
  headline: 'Supply Chain Management student · Builds operations software with AI',
  profile:
    'Supply chain student who builds the software a 90-person culinary department runs on. I taught myself full-stack development with AI coding tools and shipped production systems for labor reporting, cost forecasting, scheduling and food-cost analysis. Seeking a Spring/Summer 2027 internship in supply chain analytics, operations technology or applied AI.',
  education: {
    school: 'Brigham Young University–Hawaii',
    degree: 'B.S. Supply Chain Management, minor in Information Technology',
    dates: 'Expected Dec 2027',
    gpa: 'GPA 3.9 / 4.0',
    coursework:
      'Operations management, systems analysis, business finance, Tableau analytics, applied statistics, Cisco networking, cybersecurity, AWS cloud.',
    certifications: [
      'AWS Academy Graduate – Cloud Foundations',
      'DataCamp Data Analyst in Tableau',
      'LinkedIn Learning Excel and Canva',
    ],
  },
  experience: [
    {
      org: 'Polynesian Cultural Center (PCC), Culinary Department',
      place: 'Laie, Hawaii',
      title: 'AI, Software & Systems Specialist, reporting to the Culinary Director. Promoted within six months.',
      dates: 'Nov 2024 – Present',
      bullets: [
        'Built and run the Culinary Command Center, the department’s internal web platform (640+ commits, ~70k lines of TypeScript on React and Firebase). It replaced spreadsheets, paper forms and emailed PDFs across 3 venues.',
        'Found costing errors on 198 of 203 recipe-card ingredients: a 3.5% net forecast gap was hiding a 28% line-level variance. Proposed a 60-day recipe-correction sprint and a next-day ordering pilot.',
        'Automated the weekly labor report. Every Monday it merges guest counts (Power BI) and timesheets (UKG) for ~6,500 guests and ~1,650 labor hours, checks the data and emails labor cost per guest against target to leadership.',
        'Built a seasonal labor-cost forecast back-tested at 4.5% mean error. A headcount-based method I designed cut the payroll estimate gap from −29% to +4.7%.',
        'Built an Excel/VBA + Python auto-scheduler that raised shift coverage from 31.7% to ~75% (maximum possible 76.1%) across 77 positions and ~51 student workers, within the 19-hour weekly limit.',
        'Automated the daily KPI scorecard (31 measurables) and live guest counts (every 5 minutes, on 4 screens) by parsing PDF reports, with alerts when formats change or data goes stale. Synced 93 staff profiles from Google Sheets and secured 17 permission roles.',
      ],
    },
    {
      org: 'NathanWORKS (freelance web & automation studio)',
      place: 'Remote',
      title: 'Founder',
      dates: 'Mar 2026 – Present',
      bullets: [
        'Built and shipped client systems: a fleet and booking console for a car-rental company in Iligan City, Philippines (prevents double bookings, syncs to Google Sheets), a self-editable photographer’s website and a wedding RSVP site.',
      ],
    },
    {
      org: 'Full-time Volunteer Missionary',
      place: 'Port Vila, Vanuatu & Quezon City, Philippines',
      title: 'Leadership & community',
      dates: 'Feb 2020 – Apr 2022',
      bullets: [
        'Managed inventory and delivery routes for ~100 missionaries with a spreadsheet order-tracking system. Led ~120 training workshops and learned Bislama.',
      ],
    },
    {
      org: 'Smart Apartment Data',
      place: 'Remote, Texas',
      title: 'Online Researcher',
      dates: 'Aug 2022 – Nov 2023',
      bullets: ['Updated apartment market data through ~100 calls a day with property managers. Helped train new hires.'],
    },
    {
      org: 'Also',
      place: '',
      title: 'Videographer / Editor, AKIRA (remote) · Culinary Assistant, Beloy’s Catering',
      dates: '2022 – 2024',
      bullets: [],
    },
  ] as ResumeRole[],
  projects: [
    'Local AI assistants (Node.js, Python, Ollama, Whisper). A tool-using agent that switches between the Claude API and a local Qwen3 8B model, and an offline voice assistant with a custom-trained wake word.',
    'InteriorGen AI (React, Express, Firebase, Meshy API). Turns a text prompt or a photo into a textured 3D furniture model, with an in-browser viewer, OBJ/FBX/GLB export, Google sign-in and per-user history.',
    'Satellite remote sensing (Python, PyTorch, Google Earth Engine). A Sentinel-2 pipeline with SAM segmentation and 7 Earth Engine scripts mapping seagrass, water and wildfire at Philippine coastal sites.',
    'Taste Polynesia digital menu (React, WebCodecs, Gemini). Annotated “exploded view” dish videos, a browser video editor for staff, and a photo-to-3D pipeline that produced 10 web-ready 3D dish models.',
    'Network intrusion detection lab (Suricata 8). ~51,000 detection rules plus my own rules and PowerShell tooling.',
  ],
  skills: [
    {
      group: 'Supply chain & ops',
      items: 'Demand and labor forecasting, workforce scheduling, food-cost and variance analysis, inventory and distribution, KPI scorecards (EOS), process mapping, Excel (VBA), Tableau, Power BI',
    },
    {
      group: 'Software',
      items: 'TypeScript, React, Next.js, Node.js, Python, VBA, Google Apps Script, Git/GitHub, Vitest, Playwright, AI-assisted development (Claude Code, Codex)',
    },
    {
      group: 'Cloud, data & AI',
      items: 'Firebase, Google Cloud, AWS (EC2, security groups), Cisco networking, Suricata, Gemini and Claude APIs, Ollama, PyTorch, Google Earth Engine',
    },
    { group: 'Creative', items: 'DaVinci Resolve, Premiere Pro, After Effects, Remotion, Blender (Python scripting)' },
    { group: 'Languages', items: 'English (fluent), Tagalog, Cebuano, Surigaonon, Bislama' },
  ],
};
