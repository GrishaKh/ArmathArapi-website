# Students Directory — Design Spec

**Date:** 2026-06-27
**Status:** Approved (pre-implementation)
**Author:** Brainstormed with Claude

## Summary

Add a public **Students directory** to the Armath Arapi site: a grid of student
photos on the homepage that reveals each student's name on hover and links to a
per-student profile / portfolio page. The feature is content-driven via MDX,
mirroring the existing **Projects** architecture — no database, no admin UI, no
portal coupling. Profiles are curated in git.

This is deliberately distinct from the existing authenticated **Student Portal**
(`/student`), which is private and account-based. This feature is public,
read-only, and editorially curated.

## Goals

- Show a wall of student photos on the homepage. Hover reveals first + last name.
- Clicking a photo opens that student's profile page (`/students/[slug]`).
- Each profile is a small portfolio: photo, bio, quick-fact chips, the student's
  projects, achievements, and external links.
- Bilingual (Armenian / English), consistent with the rest of the site.

## Non-Goals

- No database storage, admin dashboard, or API for students (curated MDX only).
- No coupling to existing portal student accounts.
- No separate `/students` listing/index page in v1 — the homepage grid *is* the
  directory. (A paginated `/students` page can be added later if the roster grows.)
- No self-service editing by students.

## Architecture

Mirrors the existing **Projects** content pipeline:

```
content/students/<slug>/en.mdx   ─┐
content/students/<slug>/hy.mdx   ─┤
                                  ├─► contentlayer (Student doc type)
public/students/<photo>          ─┘        │
                                           ▼
                              lib/students.ts (typed accessors)
                                           │
                 ┌─────────────────────────┼──────────────────────────┐
                 ▼                                                      ▼
   components/sections/StudentsSection.tsx              app/students/[slug]/page.tsx
   (homepage photo grid, hover name,                    (profile / portfolio page)
    click → profile)
```

### Surfaces

1. **Homepage section** — `components/sections/StudentsSection.tsx`
   - Rendered in `app/page.tsx` immediately **after** `ProjectsSection`.
   - `id="students"` so the Header nav anchor `/#students` works like other sections.
   - Responsive grid of all students' photos.
   - **Default:** photo only. **Hover:** brand-gradient overlay reveals first +
     last name (reuse the gradient-overlay-on-hover pattern from project cards).
   - **Touch/mobile fallback:** hover does not exist on touch, so the name renders
     as an always-visible caption beneath each photo at mobile breakpoints.
   - Each photo is a `<Link href="/students/<slug>">`.

2. **Profile page** — `app/students/[slug]/page.tsx` (+ `loading.tsx`)
   - Same chrome as `app/projects/[slug]/page.tsx`: `Header showNav={false}`,
     back link, `LanguageToggle`, `notFound()` when slug/lang missing.
   - Sections:
     - **Header block:** photo, name, tagline.
     - **Basics chips:** grade/age, joined year, interests, skills (badges, like
       project "tools").
     - **Bio:** the MDX body, rendered with the same `mdxComponents` styling used
       on project pages.
     - **Linked projects:** resolve each slug in the student's `projects` list via
       `getProjectBySlug` and render the existing project card UI. Hidden if empty.
     - **Achievements:** list of strings. Hidden if empty.
     - **Links:** external links (`{label, url}`), open in new tab with
       `rel="noopener noreferrer"`. Hidden if empty.

### Navigation

- Add `"students"` to `navItems` in `components/Header.tsx`, positioned right
  after `"ourProjects"`. It is a homepage-anchor item (`/#students`), consistent
  with the other nav items.

## Data Model

### Content layout

```
content/students/
  ararat-petrosyan/
    en.mdx
    hy.mdx
public/students/
  ararat-petrosyan.jpg
```

### Contentlayer document type (`contentlayer.config.ts`)

Add a `Student` document type and include it in `makeSource({ documentTypes })`.

Fields (frontmatter):

| Field         | Type                         | Required | Notes |
|---------------|------------------------------|----------|-------|
| `id`          | string                       | yes      | Stable id. |
| `name`        | string                       | yes      | Display name (first + last). Localized per file. |
| `photo`       | string                       | no       | Path under `/public/students/`. Falls back to `/placeholder.svg`. |
| `tagline`     | string                       | no       | One-line role, e.g. "Robotics & embedded". |
| `grade`       | string                       | no       | e.g. "9th grade". (Use `grade` OR `age`.) |
| `age`         | number                       | no       | Optional alternative to grade. |
| `joinedYear`  | number                       | no       | Year they joined. |
| `interests`   | list of string               | no       | Basics chips. |
| `skills`      | list of string               | no       | Basics chips. |
| `projects`    | list of string               | no       | **Project slugs** (e.g. `["janus"]`). |
| `achievements`| list of string               | no       | Awards / competitions / events. |
| `links`       | json (`{label,url}[]`)       | no       | External links. |
| `featured`    | boolean                      | no       | Sort first when true. |
| `order`       | number                       | no       | Manual sort tiebreaker. |

Computed fields (identical to Project): `slug` (from flattened path) and
`language` (from source file name).

**MDX body = the student's bio.**

### Localization decision

Each language gets its own file (`en.mdx`, `hy.mdx`) holding that language's
content. We do **not** replicate the `...Hy` suffix-field pattern that Projects
use — that pattern is redundant because `lib/*.ts` already filters documents by
`language`. This keeps the Student type clean.

### `lib/students.ts`

```ts
export interface Student {
  id: string
  slug: string
  language: string
  name: string
  photo?: string
  tagline?: string
  grade?: string
  age?: number
  joinedYear?: number
  interests?: string[]
  skills?: string[]
  projects?: string[]          // project slugs
  achievements?: string[]
  links?: Array<{ label: string; url: string }>
  featured?: boolean
  order?: number
  body: { code: string }
}

export function getStudentBySlug(slug: string, lang: Language): Student | undefined
export function getAllStudents(lang: Language): Student[]   // featured first, then order, then name
```

Reads from `contentlayerGenerated.allStudents` with the same defensive
`?? []` fallback used in `lib/projects.ts`.

## Student ↔ Project linking

Linking is **author-controlled** via an explicit `projects` slug list on the
student, resolved with the existing `getProjectBySlug(slug, lang)`. We do **not**
fuzzy-match against the free-text `studentName` field on projects (it holds values
like `"Vardan Martirosyan & Sevak Khachatryan"` and is unreliable). Unresolvable
slugs are skipped at render time and flagged by content QA.

## Internationalization

Add keys to both the `en` and `hy` blocks of `lib/translations.ts`:

- `students` — nav label / section title ("Students" / "Աշակերտներ")
- `studentsDescription` — section subtitle
- `viewProfile` — profile link/CTA text
- `studentJoined` — "Joined" chip label
- `studentInterests`, `studentSkills` — chip group labels
- `studentAchievements` — achievements heading
- `studentLinks` — links heading
- `studentProjects` — linked-projects heading

(Exact key set finalized during implementation; the section/profile must not
hardcode user-facing strings.)

## Privacy & Consent (students are minors)

The join form targets ages 10–17, so published profiles are minors' data. The
curated-MDX model makes every published profile a deliberate editorial act, which
is the safe default. Guardrails to honor in content:

- Publish a profile only with parental/guardian consent.
- `photo` is optional (placeholder fallback) — a profile can exist without a face.
- Surname may be omitted from `name` if a family prefers first-name-only.
- No contact details, addresses, or schools in profiles.

These are content/editorial guardrails; no special code enforcement in v1.

## Error Handling

- Profile page: `notFound()` when no student matches `slug` + current `language`.
- Missing `photo`: fall back to `/placeholder.svg` (as projects do).
- Empty optional sections (projects, achievements, links, chips): render nothing,
  no empty headings.
- Unresolvable project slug in `projects`: skipped silently in UI, reported by QA.

## Testing & Verification

- `pnpm build` — exercises contentlayer generation; catches schema/field errors.
- `pnpm typecheck` — validates the new `Student` interface and accessors.
- Extend `scripts/content-qa.mjs` to validate students:
  - both `en.mdx` and `hy.mdx` exist for each slug,
  - required fields (`id`, `name`) present,
  - every slug in `projects` resolves to an existing project,
  - `photo` path (when set) exists under `public/students/`.
- Seed **one** student profile (with a placeholder photo and a linked project such
  as `janus`) so the homepage grid and the profile page render end-to-end.
- Manual/preview check: homepage grid hover reveals name (desktop), caption shows
  on mobile width, click navigates to profile, bilingual toggle works.

## Files Touched / Added

**Added**
- `content/students/<seed-slug>/en.mdx`, `.../hy.mdx`
- `public/students/<seed-photo>` (or reuse placeholder)
- `lib/students.ts`
- `components/sections/StudentsSection.tsx`
- `app/students/[slug]/page.tsx`
- `app/students/[slug]/loading.tsx` (optional, mirrors projects)

**Modified**
- `contentlayer.config.ts` (add `Student` type + register it)
- `app/page.tsx` (render `StudentsSection` after `ProjectsSection`)
- `components/Header.tsx` (add `"students"` nav item after `"ourProjects"`)
- `lib/translations.ts` (add keys to `en` and `hy`)
- `scripts/content-qa.mjs` (student validation)
- `README.md` (optional: mention the Students directory)

## Future Extensions (out of scope for v1)

- Dedicated paginated `/students` index page for a large roster.
- Reverse linking (auto-list students on a project page).
- Filter/search by interest or field of study.
- Admin-managed profiles in Supabase, if curation by non-developers is needed.
