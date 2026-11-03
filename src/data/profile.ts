// Who the site is about. Edit this file to change contact details and links.

export interface WebLink {
  id: string;
  label: string;
  /** Leave empty ('') until you have the URL; the site shows an "add link" placeholder instead of a dead link. */
  url: string;
  handle: string;
  note?: string;
}

export const profile = {
  name: 'John Dave Ugay',
  short: 'JD',
  tagline: 'Supply chain student who builds operations software with AI',
  roleLine: 'Supply chain · software · AI',
  location: 'Laie, Hawaii, USA',
  timezone: 'HST (UTC−10)',
  origin: 'Philippines',
  email: 'johndave090909@gmail.com',
  availability: 'Open to Spring/Summer 2027 internships',
  school: 'BYU–Hawaii · B.S. Supply Chain Management, IT minor · Dec 2027',
  work: 'Polynesian Cultural Center, Culinary · AI, Software & Systems Specialist',
  studio: 'NathanWORKS · web & automation studio',
  languages: 'English, Tagalog, Cebuano, Surigaonon, Bislama',
};

export const links: WebLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/johndave090909-droid',
    handle: 'johndave090909-droid',
    note: 'Public repos, including InteriorGen AI and the inventory verification system.',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/john-dave-ugay-361b02250',
    handle: 'john-dave-ugay-361b02250',
    note: 'Work history and recommendations.',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    url: '',
    handle: 'add link in src/data/profile.ts',
    note: 'Personal updates.',
  },
  {
    id: 'email',
    label: 'Email',
    url: 'mailto:johndave090909@gmail.com',
    handle: 'johndave090909@gmail.com',
    note: 'Fastest way to reach me.',
  },
  {
    id: 'nathanworks',
    label: 'NathanWORKS',
    url: '',
    handle: 'add link in src/data/profile.ts',
    note: 'Freelance web & automation studio.',
  },
  {
    id: 'verification-live',
    label: 'Live demo',
    url: 'https://verification-system-three.vercel.app',
    handle: 'verification-system-three.vercel.app',
    note: 'Inventory verification system, deployed on Vercel.',
  },
];
