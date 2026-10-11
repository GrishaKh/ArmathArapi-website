# Armath Arapi homepage revision plan

## Purpose

Visitors should first meet Armath Arapi and understand its vision, mission,
activities, and people. The atom is a defining part of the site and belongs
near the beginning. This revision follows the user's feedback and instruction
to plan and implement conservative changes in the existing website.

## Scope and approach

Adjust the existing homepage composition, hero, and shared header. Use the
original bilingual introduction and existing brand assets. Preserve the
mission/vision copy, atom visualization, typography, brand palette, accessible
controls, and all previous API, form, and metadata fixes. Do not introduce new
marketing claims or replace the atom with a generic team grid.

## Tasks

- [x] In `app/page.tsx`, use this order: Hero, About Us, Structure (atom),
  Fields of Study, Projects, Events, Materials, Students, Join, Support, Contact.
  Preserve the main landmark and skip link.
- [x] In `components/sections/HeroSection.tsx`, restore the centered Armath name,
  makerspace title, original subtitle, and brand badge. Keep working enrollment
  and projects links. Keep robotics photography in Events; age, free participation,
  and scheduling remain part of the enrollment content.
- [x] In `components/Header.tsx`, lead navigation with About Us and Structure,
  followed by Fields of Study, Projects, and Contact. Restore the full desktop
  wordmark and retain student login, language controls, accessible mobile menu,
  and the enrollment link.
- [x] Update `docs/website-improvements.md` so it records this revision accurately
  and states that future design changes should preserve the site's identity.
- [x] Run TypeScript, lint, content QA, the existing tests, and a production build.
  Check the rendered homepage order, mission/vision content, atom presence,
  heading, navigation links, and application link over local HTTP. Verify that
  the protected API, content, atom, and shared accessibility files remain unchanged.

## Acceptance criteria

The first informational sections are About Us and the atom, with no intervening
project gallery or application form. About Us and Structure are the first
navigation destinations on both desktop and mobile. The hero introduces the
organization using its original bilingual copy. Visitors can still join through
the hero/header links. No deployment or unrelated redesign is included.

## Visual verification

Inspect desktop and mobile in English and Armenian when a connected browser is
available. If the environment still has no browser, report that limitation and
use rendered HTML checks without claiming screenshots or viewport validation.

## Execution results

Implemented the homepage order, original bilingual introduction, full desktop
wordmark, and About Us/Structure navigation. Preserved the existing mission,
vision, atom, form, accessibility, metadata, and API changes.

- Production build: passed.
- TypeScript: passed.
- Full existing test suite: passed, including the 18 portal regression cases.
- Content QA and diff whitespace checks: passed.
- ESLint: zero errors, 29 existing warnings.
- Local production HTTP check: passed for the exact section order, introductory
  heading, mission/vision/activities content, atom, navigation order, enrollment
  link, student login, and desktop wordmark.
- Hash comparison: all 120 protected API, library, feature, mission/vision, atom,
  shared-content, and global accessibility files were unchanged by this revision.
- No browser is connected, so visual and interactive viewport checks remain open.

Local preview: http://127.0.0.1:3102/ . Changes have not been deployed.

## Follow-up: restore the two-column hero

The user liked the earlier two-column opening and explicitly requested its return.
The hero now pairs the Armath name and makerspace introduction, application and
project links, age range, free participation, class frequency, and the existing
interview note on the left with the FIRST Robotics team photograph on the right.
On smaller screens the photograph follows the introduction and details.

This supersedes the centered-hero portion of the earlier plan. About Us and the
atom remain immediately below the hero; the rest of the section order, navigation,
and technical fixes are unchanged.

Follow-up validation: production build, TypeScript, focused hero lint, and
whitespace checks passed. Generated HTML confirms the two-column grid, team
photograph, participation details, application/projects links, and unchanged
About Us → atom ordering. Browser visual checks remain pending.
