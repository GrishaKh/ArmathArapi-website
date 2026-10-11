# Website improvements — 2026-10-11

## Implemented in this pass

- Two-column hero: the original bilingual Armath/makerspace introduction, application and projects links, and participation details appear on the left; the FIRST Robotics team photo appears on the right. The layout stacks on mobile.
- Public navigation leads with About Us and Structure, followed by learning and projects. Student login and working application links remain available; the full enrollment form follows the informational sections.
- Readable teal text and filled controls on light surfaces (4.96:1 against white); the original cyan remains an accent.
- Visible student names, a homepage main landmark and skip link, keyboard focus, mobile menu Escape handling, and reduced-motion preferences.
- Shared content sections render visibly without waiting for JavaScript or scroll observation.
- Persistent, announced form confirmation, explicit return-to-form controls, native field validation, and Armenian public-form error messages.
- Direct telephone, email, and area map links.
- Per-page titles, descriptions, canonical URLs, sharing metadata, student sitemap entries, and noindex metadata for administration/student routes.
- Current student status and mandatory password-change checks at the shared server authorization boundary. Identity, profile, password change, and logout remain available during onboarding.
- Student-facing profile types and responses exclude internal notes and application IDs.
- Session creation checks database persistence. Administrative deactivation also revokes existing sessions.
- Upload validation, material-assignment checks, generated storage names, and cleanup when the work-record insert fails.
- Progress validation, assignment checks on reads, and consistent completion percentages/timestamps.
- Eighteen route regression tests exercise real handlers and Supabase query construction with an isolated HTTP fixture. No production database is contacted.
- CI uses Node 24, matching the verified local test runtime.

## Revision after user feedback

The homepage now opens with Hero → About Us → Structure (atom) → Fields of Study
→ Projects. Events, Materials, Students, Join, Support, and Contact follow.
The original Armath/makerspace introduction and desktop wordmark return. The user
subsequently requested the two-column hero again, pairing the introduction and
participation details with the robotics-team photo. Mission, vision,
activities, and the interactive atom remain intact. Future improvements should
preserve this identity and introductory sequence; larger visual changes need a
concrete discussion before implementation.

This revision passed the production build, TypeScript, the full existing tests,
content QA, and rendered homepage HTTP checks. ESLint remains at zero errors and
29 warnings. All 120 protected technical/content files matched their pre-revision
hashes. The current local preview is http://127.0.0.1:3102/. No browser is connected
for visual review.

Plan: [Identity-first homepage revision](superpowers/plans/2026-10-11-identity-first-homepage.md).

## Validation

- Production build passed. Existing Google Sans font-metric and Contentlayer cache warnings remain.
- TypeScript and content QA passed.
- Full test suite passed, including all 18 new portal cases.
- ESLint: zero errors, 29 warnings.
- Local production HTTP checks passed for the homepage, project listing, representative project/event/material/student details, student login, administration, and sitemap. Titles, canonicals, application links, and private-route noindex metadata were verified.
- Browser screenshots, viewport behavior, and live database/storage integration were not verified: no browser is connected and Chrome is not installed in this environment; database credentials are not configured.

## Remaining work

1. Run desktop/mobile/keyboard checks in a connected browser before deployment, especially Armenian navigation, long text, form validation, and the portal drawer.
2. Introduce stable Armenian/English URLs and server-determined language; metadata currently describes the English server-rendered content. Preserve existing URLs when designing redirects.
3. Translate the remaining Armenian Janus article, empty Armenian portal translation keys, notification messages, and date formatting.
4. Replace Janus/profile placeholders with approved real assets. Confirm the student biography and achievements and replace the example GitHub link; do not invent replacements.
5. Add verified enrollment FAQs and response-time expectations.
6. Move public content collections and heavy visualizations out of the main client dependency graph where practical; measure performance in the deployed environment.
7. Use shared rate-limit storage and account-based limits, with deployment-specific trusted proxy handling.
8. Check real enrollment, password change, material assignment, upload, review, and download journeys in an isolated staging database.

Changes are local and have not been deployed.
