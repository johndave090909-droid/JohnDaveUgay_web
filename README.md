# John Dave Ugay – portfolio

A single-screen portfolio: a GPU particle portrait with a monospace logbook UI over it. About, Projects and
Recommendations form one scrolling home page; Case studies, Resume, How I work and Around the web are pages of
their own. Every page shares one layout: the index on the left, the content on the right, the portrait in
between. On the home page the nav, the section counter and the index follow the part being read. Phones get a
bottom sheet instead.

React 19 + Vite + Tailwind v4 + three.js. No backend, no API keys.

## Run

```bash
npm install
npm run dev        # http://localhost:3001
npm run build      # static site in dist/
npm run lint       # type-check
```

## Where to edit

Everything a visitor reads lives in `src/data/`:

| File | What |
|---|---|
| `profile.ts` | Name, tagline, email, and the links under **Around the web**. A link with `url: ''` shows as "add link" instead of a dead link. |
| `projects.ts` | Project cards. They appear on the home page in this order. Set `image: '/projects/<id>.jpg'` and drop the file in `public/projects/` to replace the generated thumbnail. |
| `caseStudies.ts` | Long-form write-ups. Each one lists the project ids it belongs to. |
| `resume.ts` | The on-page resume. Keep it in step with the PDF in `public/resume/`. |
| `howIWork.ts` | The six principles and the toolkit. |
| `recommendations.ts` | Empty list = "collecting" state with reserved slots. Add entries to show quotes. |

The portrait is `public/portrait.jpg`. The dot cloud follows its brightness, so a photo with a dark or
transparent background reads best. Tuning knobs (dot size, brightness, how far the cursor scatters the
dots) are the constants at the top of `src/lib/imageParticles.ts`.

URLs are hash routes, so every section and item is linkable: `#/projects/command-center` scrolls the home
page to that project and opens its highlights, `#/case-studies/recipe-audit` and `#/resume` open those pages.

## Layout

```
src/
  App.tsx                 routes, keyboard, layout switch
  components/
    BackgroundCanvas.tsx  three.js renderer, fluid sim + particle portrait
    Brand.tsx             monogram and name, top-left
    SectionCounter.tsx    section number, top-right
    Nav.tsx               section links: home-page parts, then the other pages
    IndexList.tsx         left-hand index (desktop)
    Detail.tsx            right-hand content column
    MobileSheet.tsx       phone layout
    Thumb.tsx             generated card thumbnails
    ui.tsx                headings, prose, chips, "Label -> value" links
  views/                  one component per section; HomeView stacks About, Projects, Recommendations
  lib/
    hashRoute.ts          #/section/item routing, content scrolling, home-page scroll spy
    lists.tsx             what the index shows for each section
    fluid.ts              GPU fluid simulation (cursor wake)
    imageParticles.ts     portrait -> dots
  data/                   content
```
