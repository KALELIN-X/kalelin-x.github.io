# Kai Lin — personal portfolio

A React portfolio centered on an illustrated neon-city penthouse, with project details, professional experience, education, and a printable résumé. This is newly built work. It does not claim that these portfolio features existed in the earlier projects.

Projects and experience share one area on desktop; the profile, education, and toolkit are grouped together below. Mobile uses a single-column layout. Detailed project explanations and the résumé open in accessible dialogs, keeping the main page concise without hiding the core experience or project descriptions.

Deployment target: [kalelin-x.github.io](https://kalelin-x.github.io/). Source repository: [KALELIN-X/kalelin-x.github.io](https://github.com/KALELIN-X/kalelin-x.github.io).

## Install and run

Use Node.js 22.12 or newer (Node 24 LTS is also suitable).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173/. The development server listens only on the local computer and updates when files change. If port 5173 is busy, stop its existing server or change the port in `package.json`.

```sh
npm run check:content
npm run build
npm run preview
```

The production preview runs at http://127.0.0.1:4173/. `npm run build` validates content first and writes the static site to `dist/`.

## Publishing and updates

After the first successful deployment, GitHub Pages serves the compiled site at **https://kalelin-x.github.io/**. It stays available independently of the local development server or the owner's computer.

Push updates to the `main` branch to run the **Deploy portfolio to GitHub Pages** workflow in `.github/workflows/deploy.yml`. The workflow installs locked dependencies with `npm ci`, validates content, builds the site, and deploys the `dist/` artifact. A failed check or build prevents deployment and leaves the last successfully published version in place. The workflow can also be run manually from the repository's Actions tab.

Repository Settings → Pages uses **GitHub Actions** as its build source. The default Vite base `/` is correct for this user site. No custom domain, application server, paid service, or deployment credential is needed; the workflow uses GitHub's built-in token and Pages permissions.

For a content update, edit `src/content/portfolio.json`, run `npm run build`, commit the change, and push `main`. Review the Actions run before sharing a new version.

## Updating the content

Edit **`src/content/portfolio.json`** to manage the page and résumé together:

- `profile`: display name, GitHub link, optional LinkedIn link, and `primaryExperienceId` pointing to the role featured in the introduction. Social links are clearly labeled in the header and footer.
- `experience`: add or update roles, dates, responsibilities, technology tags, and the `current` boolean. Use a distinct `id` for each role. The displayed order follows this array.
- `education`: institution, degree, dates, status, and short description. Keep future degrees explicitly marked `Incoming`.
- `projects`: descriptions, source URLs, technologies, implementation notes, provenance, and limitations. Keep reconstruction details factual.
- `skillGroups`: toolkit headings and skills.

The main page and printable résumé read the same content; experience does not need to be updated in two components. `npm run check:content` reports malformed JSON, missing fields, duplicate IDs, and invalid source links. A build will stop with a readable message if content is invalid. Text is rendered through React, without injecting HTML.

This portfolio has **no application backend or database to maintain**. Content changes use the JSON file and a rebuild. There is no public editing endpoint. A login-protected CMS can be added later if browser-based editing becomes necessary, without changing the content structure. Appearance and general introductory copy live in `src/App.jsx` and `src/styles.css`.

## Architecture and interactions

- `src/App.jsx`: compact page layout, navigation, project illustrations, accessible native dialogs, experience, and résumé presentation.
- `src/content.js`: exposes JSON content and derives the featured role from its ID.
- `src/components/WorkspaceScene.jsx`: panoramic penthouse illustration, laptop glow, loading/error handling, and pause/resume control.
- `src/components/workspace-scene.css`: scene styling and reduced-motion behavior.
- `public/images/penthouse-city-clean.png`: locally served generated illustration; its exact source prompt and provenance are in the adjacent JSON file.
- `scripts/check-content.mjs`: content validation before production builds.

The centerpiece shows a penthouse from a diagonal aerial view, with a developer seated at a larger laptop and an orange kitten curled asleep in its cushion. The surrounding rooftops have roof surfaces, parapets and mechanical equipment. Trees are limited to ground-level sidewalk beds, with a few intentional potted plants inside the room. There are no exterior human figures. The seated developer and kitten are static parts of the illustration. A faint screen glow pulses within the laptop display. There are no animated cars. The glow is an ambient presentation effect.

Visitors can pause/resume the laptop glow. Motion also pauses when the scene is offscreen or the document is hidden. Reduced-motion preferences keep the glow still. The full 2:1 artwork remains visible without cropping or pixelated rendering, extending beyond the text column up to 1440px on wider screens. Mobile keeps the scene within the page gutters. A failed image load displays a readable message while the rest of the portfolio remains usable. The scene is labeled **Neon penthouse · illustrated** and has descriptive alternative text. There is no autoplay audio.

Visitors can skip directly to the projects. Project details open in dialogs that support Escape and restore focus to their trigger. **View résumé → Print / save PDF** uses the browser print dialog with a résumé-only layout. Saving a PDF is a browser operation; the original source PDF is not copied or exposed by this application.

The application has no analytics, trackers, API keys, accounts, or visitor-data collection and writes no browser storage. GitHub Pages may maintain its own hosting access logs. Fonts and illustration assets ship locally with the build; the running portfolio requires no remote font, image, or AI service.

## Content provenance and limitations

Experience and education were adapted from the user-supplied résumé. Responsibilities were shortened and private system names, personal contact details, and unsupported numerical impact claims were omitted. Georgia Tech remains labeled incoming January 2027. Project descriptions were checked against the linked repositories' current documentation and reconstructed implementations.

CommentScope is the newly rebuilt comment-analysis application in the existing `Pytorch-Bert-Pos-Neg-comment-detection` repository. Original toxicity/emotion labels are distinguished from added three-way sentiment analysis. Missing original model/data artifacts and replacement-model limitations are disclosed in its field notes.

UltimateGameGen was reconstructed from retained coursework documentation; its original coursework source was not recovered. The new implementation uses HTML/CSS/JavaScript with a Node/Express backend, bounded Steam queries, and a demo library. The portfolio itself uses React.

Project artwork is clearly labeled **illustrated previews** rather than screenshots or measured results and is drawn with CSS/SVG. The approved penthouse illustration was generated and refined with the built-in image-generation tool on October 11, 2026, following the owner's selected concept and room reference. The reference itself is not distributed. The scene is conceptual artwork, not a portrait of Kai, a photograph of his room, or proof of running agents. The developer and kitten are embedded in the artwork; no separate person or animal sprite is used. The black laptop and subdued green keyboard lighting are Razer-inspired; no sponsorship or affiliation is implied. The exact final prompt is recorded in `public/images/penthouse-city-clean.provenance.json`. Later revisions widened the city to 2:1, then removed exterior figures and rooftop vegetation following requested cleanup. UI icons use Lucide, and the locally bundled font is DM Sans through Fontsource.

Content validation and the production build are automated in CI. Browser checks cover desktop/mobile layout, ambient motion and pause, dialog dismissal, navigation, keyboard focus, and résumé print styles. This site is a portfolio presentation: linked projects run separately, and the illustrated dashboard is not an embedded prediction service.

## Design revision

The first local version used a warm adventure theme and a dinosaur runner. Subsequent previews explored a pixel city and separate character sprites. The current version uses the approved panoramic penthouse, an embedded seated developer and sleeping orange kitten, subtle laptop glow, and a compact charcoal layout with green/violet accents. The shared content file, verified experience/education, project provenance, and résumé workflow were retained.

An earlier revision added SVG traffic over the single flat city image. Its estimated road and building masks did not reliably hide vehicles behind the artwork's buildings, so the traffic implementation and its geometry tests were removed at the owner's request. Those tests checked the estimated polygons, not whether every animated frame matched the actual illustration. Any future traffic needs authored street and foreground-building layers, or a scene with real depth, plus visual checks across the full motion cycle.
