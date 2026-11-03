// Recommendations under [recommendations]. The section shows an empty state until this list has entries.
//
// To add one, append an object like:
// {
//   id: 'firstname-lastname',
//   name: 'Firstname Lastname',
//   role: 'Culinary Director, Polynesian Cultural Center',
//   relationship: 'Managed me, 2024 – 2026',
//   quote: 'What they said, in their words.',
//   date: '2026-11',
//   link: 'https://www.linkedin.com/in/...', // optional
// }

export interface Recommendation {
  id: string;
  name: string;
  role: string;
  relationship: string;
  quote: string;
  date: string;
  link?: string;
}

export const recommendations: Recommendation[] = [];
