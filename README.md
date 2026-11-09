# John Dave Ugay – portfolio

The landing page (`#/`) is the GPU particle portrait with a short introduction and a menu into every page. The
portrait appears there and nowhere else. About, Projects, Recommendations, Case studies, Resume, How I work and
Contact are each a plain page of their own, built for reading: a sticky header with every page (a Menu button on
narrower screens), one centred reading column, and previous/next links at the bottom. Projects and case studies
open as cards first; each card has its own page.

React 19 + Vite + Tailwind v4 + three.js. No backend, no API keys.

## Run

```bash
npm install
npm run dev        # http://localhost:3001
npm run build      # static site in dist/
npm run lint       # type-check
```

## Where to edit

Everything a visitor reads lives in `src/data/` (the About page copy is in `src/views/AboutView.tsx`):

| File | What |
|---|---|
| `profile.ts` | Name, tagline, email, and the links on the **Contact** page. A link with `url: ''` stays hidden until it has a URL. |
| `projects.ts` | Project cards, in this order, each opening its own page. Drop a screenshot in `public/projects/` and set `image: { src, alt, position? }` to replace the generated thumbnail; it also shows on the project's page. Add `video` (an `.mp4` in the same folder) to play a muted clip on the project's page, with `src` as its still. Mark a link `live: true` when it goes to a working site or the work in use: the card gets a "Live" tag and the Contact page lists it under "See my work live". |
| `caseStudies.ts` | Long-form write-ups. Each one lists the project ids it belongs to. |
| `resume.ts` | The on-page resume. Keep it in step with the PDF in `public/resume/`. |
| `howIWork.ts` | The six principles and the toolkit. |
| `recommendations.ts` | Empty list = "coming soon" note with an email button. Add entries to show quotes. |

The portrait is `public/portrait.jpg`. The dot cloud follows its brightness, so a photo with a dark or
transparent background reads best. Tuning knobs (dot size, brightness, how far the cursor scatters the
dots) are the constants at the top of `src/lib/imageParticles.ts`. On desktop the figure centres itself in the
space right of the landing text (`clearLeft` in `BackgroundCanvas.tsx`).

URLs are hash routes, so every page and item is linkable: `#/projects/command-center` and
`#/case-studies/recipe-audit` open that project or case study, `#/resume` opens the resume, `#/` the portrait.

## Layout

```
src/
  App.tsx                 routes: landing page or header + page + footer
  components/
    Landing.tsx           the portrait page: intro and the menu into every page
    BackgroundCanvas.tsx  three.js renderer, fluid sim + particle portrait (landing page only)
    SiteHeader.tsx        sticky header, page links, Menu on narrower screens
    SiteFooter.tsx        previous/next page, contact, back to top
    Brand.tsx             monogram and name, links home
    Thumb.tsx             generated card thumbnails
    ui.tsx                page intro, sections, reading text, chips, buttons, link rows
  views/                  one component per page; Projects and Case studies also hold their detail pages
  lib/
    hashRoute.ts          #/page/item routing, the page list and its order
    fluid.ts              GPU fluid simulation (cursor wake)
    imageParticles.ts     portrait -> dots
  data/                   content
```
