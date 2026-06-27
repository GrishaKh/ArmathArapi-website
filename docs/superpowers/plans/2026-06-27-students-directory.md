# Students Directory Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a public, MDX-driven Students directory to the Armath Arapi site — a homepage photo grid that reveals each student's name on hover (with an always-visible caption on mobile), each photo linking to a per-student profile/portfolio page at `/students/[slug]`. No database, no admin UI, no portal coupling. Mirrors the existing Projects content pipeline exactly.

**Architecture:** Content lives in `content/students/<slug>/{en,hy}.mdx` plus a photo under `public/students/`. A new contentlayer `Student` document type generates typed docs consumed through `lib/students.ts` (defensive `?? []` accessors). Two surfaces consume that lib: `components/sections/StudentsSection.tsx` (homepage grid, `id="students"`, wired into `app/page.tsx` after `ProjectsSection`) and `app/students/[slug]/page.tsx` (+ a route-segment `loading.tsx` and `layout.tsx` placed at the `[slug]` level). A `"students"` nav item in `components/Header.tsx` anchors to `/#students`. Content correctness is enforced by `scripts/content-qa.mjs` (extended for students), not by unit tests — this codebase verifies content via `pnpm build` + `pnpm content:qa`.

**Tech Stack:** Next.js 16 (App Router, `--webpack`), React 19.2, TypeScript (`tsc --noEmit`), Tailwind 4, contentlayer2 + next-contentlayer2, framer-motion, lucide-react, shadcn-style UI primitives (`components/ui/*`), pnpm. Content QA is a hand-rolled Node ESM script (`node:fs`/`node:path`, no YAML lib).

## Global Constraints
- Next 16 / React 19.2 / Tailwind 4 / Zod 4 floors — do not downgrade or pin below these (matches existing repo).
- Bilingual is mandatory: every student slug MUST have both `en.mdx` and `hy.mdx`; every user-facing string MUST come from `lib/translations.ts` via `t(...)` (no hardcoded UI strings).
- **i18n parity is NOT enforced by tsc.** `TranslationData = (typeof translations)["en"]` (lib/translations.ts line 823) is derived ONLY from the `en` block. The `hy` block is never structurally checked against it, and `contexts/language-context.tsx` falls back to `translations.en[key]` when an `hy` key is missing — so a one-sided insertion compiles green AND silently renders English at runtime. Any task adding translation keys MUST manually confirm both blocks received the identical key set; do not rely on `pnpm typecheck` to catch a missing/mistyped `hy` key.
- Brand colors only via hyphenated Tailwind classes: `armath-blue` (`#3EC1CF`) and `armath-red` (`#A4237E`), plus opacity variants like `bg-armath-blue/90`, `from-black/60`.
- MDX-only, no DB: students are curated in git as MDX; no admin dashboard, no API, no Supabase, no portal-account coupling.
- Localization is per-file (`en.mdx` / `hy.mdx`), NOT the `...Hy` suffix-field pattern Projects use — `lib/*.ts` already filters by `language`.
- Student↔Project linking is author-controlled via an explicit `projects` slug list resolved with `getProjectBySlug`; never fuzzy-match the free-text `studentName`. Unresolvable slugs are skipped silently in UI and flagged by QA. (Note: `getProjectBySlug` filters by `language`; a linked project that exists in only one locale would silently skip in the other locale's profile. This is acceptable because `content-qa.mjs` already enforces locale pairs on ALL project slugs, so the situation cannot arise for valid content.)
- Minors/privacy editorial rules (content-only, no code enforcement in v1): publish only with guardian consent; `photo` optional (placeholder fallback); surname may be omitted; no contact details/addresses/schools in profiles. QA does NOT scan for privacy leaks — these are editorial guardrails, not automated guards.
- The student detail back-link targets `/#students` (the homepage grid) because there is NO `/students` listing page in v1, whereas the project detail back-link targets `/projects` (which does have a listing page). This asymmetry is deliberate.
- NO separate `/students` listing/index page in v1 — the homepage grid is the directory. (Do not create `app/students/page.tsx`.)

---

### Task 1: Add `Student` contentlayer doc type + `lib/students.ts`

**Files:**
- Modify: `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/contentlayer.config.ts` (add doc type after the `Material` block ~line 127; update `makeSource` `documentTypes` array at lines 129–132)
- Create: `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/lib/students.ts`

**Interfaces:**
- Produces (TS): `interface Student { id; slug; language; name; photo?; tagline?; grade?; age?; joinedYear?; interests?; skills?; projects?; achievements?; links?: Array<{ label: string; url: string }>; featured?; order?; body: { code: string } }`
- Produces (functions later tasks rely on):
  - `getStudentBySlug(slug: string, lang: Language): Student | undefined`
  - `getAllStudents(lang: Language): Student[]` — featured first, then `order` ascending, then `name` alphabetically.
- Produces (contentlayer): a `Student` document with `filePathPattern: 'students/**/*.mdx'`, registered in `makeSource`.

Naming note: projects expose `getProjectsSortedByYear`; students expose `getAllStudents`. The two libs read differently because the sort differs (featured/order/name vs year). This plan uses `getAllStudents` everywhere internally and does NOT half-rename — leave it as `getAllStudents`.

This task has no unit test (content/components are not unit-tested in this repo). It is verified by `pnpm typecheck` + `pnpm build`. The build cannot fully exercise `Student` until a seed MDX exists (Task 3), so Task 1 verifies the config/lib compile and the generated module shape is referenced safely.

- [ ] Read the current `contentlayer.config.ts` to confirm the `Material` block ends near line 127 and `makeSource` is at lines 129–132.

- [ ] Insert the `Student` document type immediately AFTER the `Material` `defineDocumentType` block and BEFORE `export default makeSource(...)`. Use this exact code (computed fields are copied verbatim from `Project`):

```ts
export const Student = defineDocumentType(() => ({
    name: 'Student',
    filePathPattern: `students/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        photo: { type: 'string', required: false },
        tagline: { type: 'string', required: false },
        grade: { type: 'string', required: false },
        age: { type: 'number', required: false },
        joinedYear: { type: 'number', required: false },
        interests: { type: 'list', of: { type: 'string' }, required: false },
        skills: { type: 'list', of: { type: 'string' }, required: false },
        projects: { type: 'list', of: { type: 'string' }, required: false },
        achievements: { type: 'list', of: { type: 'string' }, required: false },
        links: { type: 'json', required: false }, // Array<{ label: string; url: string }>
        featured: { type: 'boolean', required: false },
        order: { type: 'number', required: false },
    },
    computedFields: {
        slug: {
            type: 'string',
            resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
        },
        language: {
            type: 'string',
            resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, '') as 'en' | 'hy',
        }
    },
}))
```

- [ ] Update the `makeSource` registration (currently `documentTypes: [Event, Project, Material]`) to include `Student`:

```ts
export default makeSource({
    contentDirPath: 'content',
    documentTypes: [Event, Project, Material, Student],
})
```

- [ ] Create `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/lib/students.ts` with this exact content (mirrors `lib/projects.ts` import + defensive `?? []` pattern verbatim):

```ts
import type { Language } from './translations'
import * as contentlayerGenerated from 'contentlayer2/generated'

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
  projects?: string[]
  achievements?: string[]
  links?: Array<{ label: string; url: string }>
  featured?: boolean
  order?: number
  body: { code: string }
}

const generated = contentlayerGenerated as unknown as { allStudents?: Student[] }
const allStudents = generated.allStudents ?? []

export function getStudentBySlug(slug: string, lang: Language): Student | undefined {
  return allStudents.find((student) => student.slug === slug && student.language === lang)
}

export function getAllStudents(lang: Language): Student[] {
  return allStudents
    .filter((student) => student.language === lang)
    .sort((a, b) => {
      const featuredA = a.featured ? 1 : 0
      const featuredB = b.featured ? 1 : 0
      if (featuredA !== featuredB) return featuredB - featuredA
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER
      if (orderA !== orderB) return orderA - orderB
      return a.name.localeCompare(b.name)
    })
}
```

- [ ] Run typecheck. Expected: exits 0 with no output (the `as unknown as { allStudents?: Student[] }` cast means it compiles even before contentlayer generates `allStudents`).

```bash
pnpm typecheck
```

- [ ] Run the build. Expected: completes successfully (`✓ Compiled` / `✓ Generating static pages`), and contentlayer logs a line for documents generated. With no student MDX yet, `allStudents` will be empty but the type is registered.

```bash
pnpm build
```

- [ ] Commit:

```bash
git add contentlayer.config.ts lib/students.ts
git commit -m "feat(students): add Student contentlayer doc type and lib/students.ts

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Add i18n keys to `lib/translations.ts`

**Files:**
- Modify: `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/lib/translations.ts` — insert keys in the `en` block before its closing `},` (line 410) and the SAME keys in the `hy` block before its closing `},` (line 819).

**Interfaces:**
- Produces (valid `TranslationKey`s consumed by Tasks 4–6): `students`, `studentsDescription`, `viewProfile`, `studentJoined`, `studentInterests`, `studentSkills`, `studentAchievements`, `studentLinks`, `studentProjects`, `studentGrade`, `studentAge`, `backToStudents`.
- Reuses (already present in both blocks, do NOT re-add): `viewProject` (en line 85 / hy line 494), used for the linked-project card CTA in Task 6.

**CRITICAL — parity is not type-checked.** As stated in Global Constraints, `TranslationData` is derived only from the `en` block, so `tsc` will NOT report a missing or mistyped `hy` key — a one-sided insertion compiles green and silently renders English at runtime via the `translations.en[key]` fallback in `contexts/language-context.tsx`. You MUST manually verify both blocks received all 12 keys (verification step below diffs them).

- [ ] Read `lib/translations.ts` around line 405–411 to locate the exact last `en` key (`attendanceNoEntriesYet: "No tap-ins recorded yet.",` at line 409) and the `en` closing brace `},` at line 410.

- [ ] In the `en` block, insert this section immediately BEFORE the `en` closing brace `},` (line 410). Use exactly this text (12 keys):

```ts
    // Students
    students: "Students",
    studentsDescription: "Meet the students building at Armath Arapi",
    viewProfile: "View profile",
    studentJoined: "Joined",
    studentGrade: "Grade",
    studentAge: "Age",
    studentInterests: "Interests",
    studentSkills: "Skills",
    studentProjects: "Projects",
    studentAchievements: "Achievements",
    studentLinks: "Links",
    backToStudents: "Back to students",
```

- [ ] Read `lib/translations.ts` around line 814–819 to locate the last `hy` key (`attendanceNoEntriesYet: "Մուտքեր դեռ գրանցված չեն։",` at line 818) and the `hy` closing brace `},` at line 819.

- [ ] In the `hy` block, insert this section immediately BEFORE the `hy` closing brace `},` (line 819). Use exactly this text (the SAME 12 keys as the `en` block — any omission or typo here renders English at runtime undetected):

```ts
    // Students
    students: "Աշակերտներ",
    studentsDescription: "Ծանոթացեք Արմաթ Արափիի աշակերտներին",
    viewProfile: "Դիտել պրոֆիլը",
    studentJoined: "Միացել է",
    studentGrade: "Դասարան",
    studentAge: "Տարիք",
    studentInterests: "Հետաքրքրություններ",
    studentSkills: "Հմտություններ",
    studentProjects: "Նախագծեր",
    studentAchievements: "Ձեռքբերումներ",
    studentLinks: "Հղումներ",
    backToStudents: "Վերադառնալ աշակերտներ",
```

- [ ] Run typecheck. Expected: exits 0 with no output. NOTE: tsc passing does NOT confirm parity — it only confirms the `en` keys are well-formed. Continue to the explicit parity check below.

```bash
pnpm typecheck
```

- [ ] Explicitly verify both blocks received the identical 12-key set. Run this command, which extracts each new key name from each block and diffs them. Expected: NO output (an empty diff means both blocks match). Any line of output means a key is missing or misspelled in one block — fix it before committing.

```bash
node -e '
const fs = require("fs");
const src = fs.readFileSync("lib/translations.ts", "utf8");
const keys = ["students","studentsDescription","viewProfile","studentJoined","studentGrade","studentAge","studentInterests","studentSkills","studentProjects","studentAchievements","studentLinks","backToStudents"];
const en = src.slice(0, src.indexOf("},"));
const hy = src.slice(src.indexOf("},") + 2);
const missingEn = keys.filter(k => !new RegExp("\\b"+k+":").test(en));
const missingHy = keys.filter(k => !new RegExp("\\b"+k+":").test(hy));
if (missingEn.length) console.log("MISSING in en:", missingEn.join(", "));
if (missingHy.length) console.log("MISSING in hy:", missingHy.join(", "));
'
```

- [ ] Commit:

```bash
git add lib/translations.ts
git commit -m "feat(students): add bilingual i18n keys for students directory

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Seed one student MDX (en + hy) + photo, register `students` content type in QA

**Files:**
- Create: `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/content/students/ararat-petrosyan/en.mdx`
- Create: `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/content/students/ararat-petrosyan/hy.mdx`
- Modify: `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/scripts/content-qa.mjs` (add `students` entry to `docTypeConfig`, lines 13–23)

**Interfaces:**
- Produces (content): one student slug `ararat-petrosyan` with both locales, `id: "1"` in both, `photo: "/placeholder.svg"`, `projects: ["janus"]` (resolves to the existing `content/projects/janus`).
- Consumes: the `Student` doc type (Task 1) and `getStudentBySlug`/`getAllStudents` (Task 1).

The seed must exist before extending QA, because `scripts/content-qa.mjs` does `fs.readdirSync(typeDir)` unguarded — registering `students` without the dir would throw ENOENT. We create the dir + MDX first, then add the QA config entry.

The base `docTypeConfig` validates the generic `image` scalar key, but students use `photo` (not `image`). Photo-existence validation is therefore intentionally DEFERRED to Task 7 (which adds a students-specific check). Do NOT add a duplicate `image` requiredKey for students here. Between this task and Task 7, the seed photo path is only confirmed to exist by the Task 8 build; the ordering is sound because Task 7 immediately follows.

- [ ] Create the directory and `content/students/ararat-petrosyan/en.mdx` with exactly this content. Frontmatter MUST start with `---` on line 1 and close with `---`; `photo: "/placeholder.svg"` resolves to the existing `public/placeholder.svg` (a root-level placeholder, not under `public/students/` — Task 7's photo check intentionally generalizes the spec's `public/students/` wording to allow this); NO `language:` key (computed by contentlayer):

```mdx
---
id: "1"
name: "Ararat Petrosyan"
photo: "/placeholder.svg"
tagline: "Robotics & embedded systems"
grade: "9th grade"
joinedYear: 2024
interests:
  - "Robotics"
  - "Microcontrollers"
  - "3D printing"
skills:
  - "C++"
  - "ESP32"
  - "Soldering"
projects:
  - "janus"
achievements:
  - "DigiCode 2026 participant"
  - "Regional robotics olympiad finalist"
links:
  - label: "GitHub"
    url: "https://github.com/example-ararat"
featured: true
order: 1
---

## About me

I joined Armath Arapi to build things that move and sense the world. My favorite
work sits at the boundary of hardware and software — embedded firmware, sensors,
and the small circuits that tie them together.

Right now I am focused on intrusion-detection and attendance systems built on the
ESP32, learning how reliable, offline-first devices are engineered end to end.
```

- [ ] Create `content/students/ararat-petrosyan/hy.mdx` with exactly this content. The `id` MUST equal `"1"` (cross-locale match), `photo` identical, `projects` identical (project slugs are language-agnostic); the translatable scalars/lists and body are in Armenian:

```mdx
---
id: "1"
name: "Արարատ Պետրոսյան"
photo: "/placeholder.svg"
tagline: "Ռոբոտաշինություն և ներդրված համակարգեր"
grade: "9-րդ դասարան"
joinedYear: 2024
interests:
  - "Ռոբոտաշինություն"
  - "Միկրոկառավարիչներ"
  - "3D տպագրություն"
skills:
  - "C++"
  - "ESP32"
  - "Զոդում"
projects:
  - "janus"
achievements:
  - "DigiCode 2026-ի մասնակից"
  - "Տարածաշրջանային ռոբոտաշինության օլիմպիադայի եզրափակիչ"
links:
  - label: "GitHub"
    url: "https://github.com/example-ararat"
featured: true
order: 1
---

## Իմ մասին

Ես միացա Արմաթ Արափիին՝ ստեղծելու բաներ, որոնք շարժվում և զգում են շրջապատը։
Իմ սիրելի աշխատանքը գտնվում է ապարատային և ծրագրային ապահովման սահմանին՝
ներդրված ծրագրակազմ, սենսորներ և դրանք կապող փոքր սխեմաներ։

Հիմա կենտրոնացած եմ ESP32-ի վրա հիմնված ներխուժման հայտնաբերման և
ներկայության համակարգերի վրա՝ սովորելով, թե ինչպես են նախագծվում հուսալի,
օֆլայն-առաջնահերթ սարքերը։
```

- [ ] Read `scripts/content-qa.mjs` lines 13–23 to confirm the `docTypeConfig` object shape (`events`, `projects`, `materials` entries each with `requiredKeys`).

- [ ] Add a `students` entry to `docTypeConfig`. Insert it after the `materials` entry, before the closing `}` of the object. Use exactly:

```js
  students: {
    requiredKeys: ["id", "name"],
  },
```

(Generic discovery, locale-pair check, required-key check, `language:` ban, and cross-locale id match all apply automatically. The project-slug-resolution and photo-existence checks are students-specific and are added in Task 7 — not here.)

- [ ] Run content QA. Expected stdout: `Content QA checks passed.` and exit code 0. (Both locale files exist, `id` matches across locales, `name`+`id` present, no `language:` key.)

```bash
pnpm content:qa
```

- [ ] Run the build. Expected: completes successfully; contentlayer now generates the `Student` documents (you should see student docs counted in the contentlayer log). No type errors.

```bash
pnpm build
```

- [ ] Commit:

```bash
git add content/students scripts/content-qa.mjs
git commit -m "feat(students): seed ararat-petrosyan profile and register students in content QA

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: `StudentsSection` homepage grid + wire into `app/page.tsx`

**Files:**
- Create: `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/components/sections/StudentsSection.tsx`
- Modify: `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/app/page.tsx` (add import alongside the other section imports; render `<StudentsSection />` immediately after `<ProjectsSection />`)

**Interfaces:**
- Consumes: `getAllStudents` from `@/lib/students` (Task 1); `useLanguage` from `@/contexts/language-context`; `AnimatedSection` from `@/components/animated-section`; translation keys `students`, `studentsDescription` (Task 2); `viewProfile` (Task 2) as the accessible label for the photo overlay/caption (semantically correct here — this card DOES link to a profile).
- Produces: a `<section id="students">` so the Header anchor `/#students` (Task 5) resolves; an exported `StudentsSection` component.

Requirements satisfied here: photo grid; hover reveals first+last name via the gradient-overlay-on-hover pattern (`group` on Card, `opacity-0 group-hover:opacity-100 transition-opacity duration-300`); mobile caption fallback (always-visible name shown only at mobile widths via `md:hidden`, hover overlay hidden on mobile via `hidden md:flex`); each photo wrapped in `<Link href="/students/<slug>">`; placeholder photo fallback; empty-roster safety (renders nothing when there are no students).

- [ ] Create `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/components/sections/StudentsSection.tsx` with exactly this content (`Card` + `group` + gradient overlay pattern from `ProjectsSection`; grid classes match the homepage preview grid; hover name overlay desktop-only, caption mobile-only):

```tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { getAllStudents } from "@/lib/students"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"

export function StudentsSection() {
  const { t, language } = useLanguage()
  const students = getAllStudents(language)

  if (students.length === 0) {
    return null
  }

  return (
    <section id="students" className="py-24 bg-transparent">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">{t("students")}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">{t("studentsDescription")}</p>
        </AnimatedSection>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
          {students.map((student, index) => (
            <AnimatedSection
              key={student.id}
              animation="fadeInUp"
              delay={index * 0.1}
              className="w-full min-w-0"
            >
              <Link
                href={`/students/${student.slug}`}
                aria-label={`${student.name} — ${t("viewProfile")}`}
                className="block h-full w-full"
              >
                <Card className="group h-full w-full overflow-hidden border-slate-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col rounded-xl">
                  <div className="relative overflow-hidden shrink-0 w-full">
                    <Image
                      src={student.photo || "/placeholder.svg"}
                      alt={student.name}
                      width={400}
                      height={400}
                      className="object-cover group-hover:scale-105 transition-transform duration-700 w-full aspect-square"
                    />
                    {/* Hover name reveal (desktop only) */}
                    <div className="absolute inset-0 hidden md:flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="p-4 text-base font-semibold text-white drop-shadow">
                        {student.name}
                      </span>
                    </div>
                  </div>
                  {/* Always-visible caption (mobile only) */}
                  <div className="md:hidden p-3">
                    <span className="block text-sm font-medium text-slate-900">{student.name}</span>
                  </div>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] Read `app/page.tsx` to confirm the section import block and the `<ProjectsSection />` render position.

- [ ] In `app/page.tsx`, add the import. Insert this line in the section-imports block (the block is not alphabetized, so any position inside it is fine):

```tsx
import { StudentsSection } from "@/components/sections/StudentsSection"
```

- [ ] In `app/page.tsx`, render `<StudentsSection />` immediately AFTER `<ProjectsSection />`. The result must read:

```tsx
      {/* Projects Section */}
      <ProjectsSection />
      {/* Students Section */}
      <StudentsSection />
      {/* Join Section */}
      <JoinSection />
```

- [ ] Run typecheck. Expected: exits 0 with no output.

```bash
pnpm typecheck
```

- [ ] Run the build. Expected: completes successfully; the homepage route compiles with the new section.

```bash
pnpm build
```

- [ ] Commit:

```bash
git add components/sections/StudentsSection.tsx app/page.tsx
git commit -m "feat(students): add homepage StudentsSection grid with hover name reveal

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Add `"students"` nav item to `components/Header.tsx`

**Files:**
- Modify: `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/components/Header.tsx` (the `navItems: TranslationKey[]` array)

**Interfaces:**
- Consumes: the `students` `TranslationKey` (Task 2) and the `<section id="students">` (Task 4) — the nav key string MUST exactly equal the section id so `/#students` resolves.

The `navItems` array drives both desktop and mobile menus, so one edit updates both. No unit test — verified by `pnpm typecheck` (the array is typed `TranslationKey[]`, so an invalid key fails compilation) and `pnpm build`.

- [ ] Read `components/Header.tsx` to confirm the `navItems` array (currently ends `..., "ourProjects", "supportArmath", "contact"]`).

- [ ] Insert `"students"` immediately AFTER `"ourProjects"` in the `navItems` array. The result must read exactly:

```tsx
const navItems: TranslationKey[] = [
  "aboutUs",
  "structure",
  "fieldsOfStudy",
  "learningMaterials",
  "events",
  "ourProjects",
  "students",
  "supportArmath",
  "contact",
]
```

- [ ] Run typecheck. Expected: exits 0 (the string `"students"` is now a valid `TranslationKey` from Task 2).

```bash
pnpm typecheck
```

- [ ] Run the build. Expected: completes successfully.

```bash
pnpm build
```

- [ ] Commit:

```bash
git add components/Header.tsx
git commit -m "feat(students): add students nav item anchoring to /#students

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: Profile page `app/students/[slug]/page.tsx` + `loading.tsx` + `layout.tsx`

**Files:**
- Create: `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/app/students/[slug]/page.tsx`
- Create: `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/app/students/[slug]/loading.tsx`
- Create: `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/app/students/[slug]/layout.tsx`

**Placement note:** `loading.tsx` and `layout.tsx` are NEW route-segment files created at the `app/students/[slug]/` level. They are NOT literal siblings of the existing project pages — `app/projects/loading.tsx` and `app/projects/layout.tsx` live at the `app/projects/` (listing) level, and there is no `app/projects/[slug]/loading.tsx`/`layout.tsx`. Next.js supports `loading.tsx`/`layout.tsx` at any route segment, so placing them at `[slug]` is valid; their contents are reproduced from the projects versions verbatim with strings adjusted.

**Interfaces:**
- Consumes: `getStudentBySlug` from `@/lib/students` (Task 1); `getProjectBySlug` from `@/lib/projects` (existing) to resolve linked projects; `useLanguage`, `useMDXComponent`, `notFound`, `AnimatedSection`, `Card`/`Badge`/`Button` primitives, `LanguageToggle`; translation keys from Task 2 (`backToStudents`, `studentJoined`, `studentGrade`, `studentAge`, `studentInterests`, `studentSkills`, `studentProjects`, `studentAchievements`, `studentLinks`) plus the existing key `viewProject` (en line 85 / hy line 494) for the linked-project card CTA, plus existing keys `logo`, `armathArapi`.
- Produces: route `/students/[slug]`.

Mirrors `app/projects/[slug]/page.tsx` exactly: `"use client"`, `use(params)`, `useLanguage()`, `notFound()` guard, then `useMDXComponent(student.body.code)` in THAT order. Reuses the `mdxComponents` object verbatim. Localization is per-file so NO `...Hy` fallback is needed — fields are read directly. Empty optional sections render nothing (no empty headings). Unresolvable project slugs are skipped silently. The not-found path is covered by `notFound()` (no empty-state component needed, matching the projects page). `loading.tsx` mirrors the projects spinner; `layout.tsx` (a Server Component) holds metadata because `page.tsx` is a Client Component.

**Linked-project card CTA:** the card links to `/projects/<slug>` (a project), so its CTA uses `t("viewProject")` ("View Project" / "Դիտել նախագիծը"), NOT `t("viewProfile")`. Using `viewProfile` there would be a semantic label mismatch. `viewProfile` is used only on the homepage grid (Task 4), where the link genuinely goes to a profile.

**Linked-project card padding:** the linked-project `CardContent` follows the image directly with no `CardHeader` above it. The default `CardContent` padding is `p-6 pt-0 md:p-7 md:pt-0` (zero top padding, intended to sit under a header), so the title would render flush against the image. We add `pt-6 md:pt-7` to restore the top gap.

- [ ] Create `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/app/students/[slug]/loading.tsx` with exactly this content (reproduced from `app/projects/loading.tsx` with the message changed):

```tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-armath-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 text-sm">Loading student...</p>
      </div>
    </div>
  )
}
```

- [ ] Create `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/app/students/[slug]/layout.tsx` with exactly this content (reproduced from `app/projects/layout.tsx` with strings changed):

```tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Students | Armath Arapi",
  description: "Meet the students of Armath Arapi Engineering Makerspace and explore their portfolios.",
}

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
```

- [ ] Create `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/app/students/[slug]/page.tsx` with exactly this content (header/back-link/logo/`LanguageToggle` markup, `mdxComponents`, `AnimatedSection` usage, `Card`/`Badge`/`Image` patterns, and the `cn(..., language === "hy" && "text-4xl")` title trick all carry over from the project detail page; linked projects resolved via `getProjectBySlug`, rendered with a `viewProject` CTA and `pt-6 md:pt-7` on the `CardContent`):

```tsx
"use client"

import { use } from "react"
import { useMDXComponent } from "next-contentlayer2/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ExternalLink, Zap } from "lucide-react"
import { getStudentBySlug } from "@/lib/students"
import { getProjectBySlug } from "@/lib/projects"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"
import { LanguageToggle } from "@/components/language-toggle"

// Custom MDX components to match current styling
const mdxComponents = {
  h2: (props: any) => <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8" {...props} />,
  p: (props: any) => <p className="text-slate-600 text-lg leading-relaxed mb-4" {...props} />,
  ul: (props: any) => <ul className="space-y-4 mb-6" {...props} />,
  li: (props: any) => (
    <li className="flex gap-4" {...props}>
      <Zap className="w-6 h-6 text-armath-blue shrink-0 mt-1" />
      <span className="text-slate-600 text-lg">{props.children}</span>
    </li>
  ),
}

interface Props {
  params: Promise<{ slug: string }>
}

export default function StudentProfilePage({ params }: Props) {
  const { slug } = use(params)
  const { t, language } = useLanguage()
  const student = getStudentBySlug(slug, language)

  if (!student) {
    notFound()
  }

  const MDXContent = useMDXComponent(student.body.code)

  const interests = student.interests || []
  const skills = student.skills || []
  const achievements = student.achievements || []
  const links = student.links || []
  const projectSlugs = student.projects || []
  const linkedProjects = projectSlugs
    .map((projectSlug) => getProjectBySlug(projectSlug, language))
    .filter((project): project is NonNullable<typeof project> => Boolean(project))

  return (
    <div className="min-h-screen">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/#students" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t("backToStudents")}</span>
          </Link>
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <motion.div
              className="relative h-10 w-10 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm sm:hidden"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <Image src="/logo.png" alt={t("logo")} fill className="object-contain p-1.5" sizes="48px" />
            </motion.div>
            <motion.div
              className="relative hidden h-11 w-[176px] sm:block"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/ArmathArapi_logo.png"
                alt={t("armathArapi") + " " + t("logo")}
                fill
                className="object-contain"
                sizes="176px"
              />
            </motion.div>
          </Link>
          <LanguageToggle />
        </div>
      </motion.header>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Header block: photo + name + tagline */}
            <div className="grid md:grid-cols-[280px_1fr] gap-8 items-center">
              <AnimatedSection animation="fadeInUp" delay={0.2}>
                <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200/80 shadow-lg">
                  <Image src={student.photo || "/placeholder.svg"} alt={student.name} fill className="object-cover" />
                </div>
              </AnimatedSection>
              <AnimatedSection>
                <h1 className={cn("text-5xl font-bold text-slate-900 mb-4", language === "hy" && "text-4xl")}>
                  {student.name}
                </h1>
                {student.tagline && <p className="text-xl text-slate-600 mb-6">{student.tagline}</p>}
                <div className="flex flex-wrap gap-2">
                  {student.grade && (
                    <Badge variant="secondary" className="text-sm">
                      {t("studentGrade")}: {student.grade}
                    </Badge>
                  )}
                  {typeof student.age === "number" && (
                    <Badge variant="secondary" className="text-sm">
                      {t("studentAge")}: {student.age}
                    </Badge>
                  )}
                  {typeof student.joinedYear === "number" && (
                    <Badge variant="secondary" className="text-sm">
                      {t("studentJoined")}: {student.joinedYear}
                    </Badge>
                  )}
                </div>
              </AnimatedSection>
            </div>

            {/* Basics chips: interests + skills */}
            {(interests.length > 0 || skills.length > 0) && (
              <AnimatedSection animation="fadeInUp" delay={0.1}>
                <div className="grid md:grid-cols-2 gap-8">
                  {interests.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-slate-900">{t("studentInterests")}</h2>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-sm">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {skills.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-slate-900">{t("studentSkills")}</h2>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            )}

            {/* Bio = MDX body */}
            <AnimatedSection>
              <article className="prose prose-lg max-w-none">
                <MDXContent components={mdxComponents} />
              </article>
            </AnimatedSection>

            {/* Linked projects */}
            {linkedProjects.length > 0 && (
              <AnimatedSection animation="fadeInUp" delay={0.3}>
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-slate-900">{t("studentProjects")}</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {linkedProjects.map((project) => (
                      <Link key={project.slug} href={`/projects/${project.slug}`} className="block h-full w-full">
                        <Card className="group h-full w-full overflow-hidden border-slate-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col rounded-xl">
                          <div className="relative overflow-hidden shrink-0 w-full">
                            <Image
                              src={project.image || "/placeholder.svg"}
                              alt={project.title}
                              width={800}
                              height={500}
                              className="object-cover group-hover:scale-105 transition-transform duration-700 w-full h-48"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <CardContent className="flex flex-col gap-2 pt-6 md:pt-7">
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-armath-blue transition-colors line-clamp-2">
                              {project.title}
                            </h3>
                            <div className="flex items-center text-sm font-medium text-armath-blue group-hover:gap-2 transition-all">
                              {t("viewProject")}
                              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <AnimatedSection animation="fadeInUp" delay={0.4}>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-slate-900">{t("studentAchievements")}</h2>
                  <ul className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-3 text-slate-600"
                      >
                        <span className="text-armath-blue font-bold mt-1 shrink-0">✓</span>
                        <span className="text-lg leading-relaxed">{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {/* Links */}
            {links.length > 0 && (
              <AnimatedSection animation="fadeInUp" delay={0.5}>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("studentLinks")}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                    {links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="border-armath-blue/30 text-armath-blue">
                          {link.label}
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    ))}
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
```

- [ ] Run typecheck. Expected: exits 0 with no output.

```bash
pnpm typecheck
```

- [ ] Run the build. Expected: completes successfully; the dynamic route `/students/[slug]` appears in the build route output, and the seed slug renders.

```bash
pnpm build
```

- [ ] Commit:

```bash
git add app/students
git commit -m "feat(students): add student profile page, loading, and layout

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: Extend `scripts/content-qa.mjs` with student-specific checks (project slugs resolve, photo path exists)

**Files:**
- Modify: `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/scripts/content-qa.mjs` — add a `validateStudentExtras(typeDir, slugDirName)` helper and invoke it from the discovery loop only for the `students` type.

**Interfaces:**
- Consumes: existing helpers `readFile`, `parseFrontmatter`, `getFrontmatterScalar`, the shared `errors` array, `contentRoot`, `publicRoot`, `locales`. (The generic locale-pair / required-keys / id-match / `language:`-ban checks are already wired from Task 3.)
- Produces: two new validations for students — (a) every slug in the `projects` list resolves to an existing `content/projects/<slug>` directory; (b) the `photo` path (when set and starting with `/`) exists under `public/`.

The base QA only validates scalar frontmatter and the generic `image` key. Students use `photo` (not `image`) and a list `projects` of project slugs, so these need a dedicated, students-only check. We parse the `projects` block items with a small regex (the existing `getFrontmatterScalar` only handles single-line scalars), and we resolve each against the `content/projects/` directory listing.

**Spec-wording deviation (intentional):** spec line 218 says the photo check should verify the path exists under `public/students/`. This helper checks the photo exists under `public/` ANYWHERE (`path.join(publicRoot, photo...)`), which is the correct/necessary behavior — the seed deliberately uses `/placeholder.svg`, a root-level asset the spec's own placeholder-fallback design relies on. Generalizing to `public/` accommodates that fallback.

**Error-formatting consistency:** `validateLocalePair` already parses these same `en.mdx`/`hy.mdx` files. This helper re-parses them, and `parseFrontmatter` pushes to the shared `errors` array on a malformed delimiter — which would double-report a frontmatter parse failure (once by `validateLocalePair` with a `path.relative()`-formatted path, once here). To keep error formatting consistent with every other QA message (all use `path.relative(root, ...)`) and avoid a duplicate with a differently-formatted path, this helper passes `path.relative(contentRoot, filePath)`-derived relative paths to `parseFrontmatter` and only runs the photo/projects checks when `parseFrontmatter` returns non-null (so a malformed file is skipped here and reported once by `validateLocalePair`).

- [ ] Read `scripts/content-qa.mjs` lines 49–53 (the `getFrontmatterScalar` helper), the signature of `parseFrontmatter` (confirm its second argument is the path used in error messages), and lines 113–124 (the discovery loop) to confirm exact names before editing.

- [ ] Add a new helper function immediately AFTER the `validateLocalePair` function (after its closing brace, before the discovery loop near line 113). Use exactly this code (note the `parseFrontmatter` call passes a path relative to the content root, matching the format every other message uses, and a parse failure here is silently skipped because `validateLocalePair` already reported it):

```js
function validateStudentExtras(typeDir, slugDirName) {
  const projectsDir = path.join(contentRoot, "projects")
  const knownProjectSlugs = fs.existsSync(projectsDir)
    ? fs
        .readdirSync(projectsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : []

  for (const locale of locales) {
    const filePath = path.join(typeDir, slugDirName, `${locale}.mdx`)
    if (!fs.existsSync(filePath)) {
      continue
    }
    const source = readFile(filePath)
    const relativePath = path.relative(contentRoot, filePath)
    // validateLocalePair already parsed (and, on malformed frontmatter, reported)
    // this file. Re-parse only to read fields; if it returns null the file is
    // malformed and was already flagged once — skip silently to avoid a duplicate.
    const frontmatter = parseFrontmatter(source, relativePath)
    if (!frontmatter) {
      continue
    }

    // photo path (when set and root-relative) must exist under public/
    // (generalizes the spec's public/students/ wording to allow root-level
    // placeholders such as /placeholder.svg, which the fallback design relies on)
    const photo = getFrontmatterScalar(frontmatter, "photo")
    if (photo && photo.startsWith("/")) {
      const assetPath = path.join(publicRoot, photo.replace(/^\//, ""))
      if (!fs.existsSync(assetPath)) {
        errors.push(`students/${slugDirName}/${locale}.mdx: photo asset not found at public${photo}`)
      }
    }

    // every projects: slug must resolve to an existing content/projects/<slug>
    const projectsBlockMatch = frontmatter.match(/^projects:\s*\n((?:\s*-\s*.+\n?)+)/m)
    if (projectsBlockMatch) {
      const itemRegex = /^\s*-\s*["']?([^\n"']+?)["']?\s*$/gm
      let match
      while ((match = itemRegex.exec(projectsBlockMatch[1])) !== null) {
        const projectSlug = match[1].trim()
        if (!knownProjectSlugs.includes(projectSlug)) {
          errors.push(
            `students/${slugDirName}/${locale}.mdx: projects slug "${projectSlug}" does not resolve to content/projects/${projectSlug}`
          )
        }
      }
    }
  }
}
```

(If, after reading the file, `parseFrontmatter`'s second argument turns out to be an absolute path passed straight through to error messages or not used for formatting at all, adjust the `relativePath` argument accordingly to keep this helper's message format identical to `validateLocalePair`'s. The guard against the double-report — skipping when `parseFrontmatter` returns null — applies regardless.)

- [ ] Read the discovery loop (lines 113–124) and modify it so that the `students` type also runs `validateStudentExtras`. The loop currently calls only `validateLocalePair(typeDir, slug)`. Update the inner `for (const slug of slugs)` body to:

```js
  for (const slug of slugs) {
    validateLocalePair(typeDir, slug)
    if (contentType === "students") {
      validateStudentExtras(typeDir, slug)
    }
  }
```

- [ ] Run content QA on the current (correct) seed. Expected stdout: `Content QA checks passed.`, exit 0. (`photo: "/placeholder.svg"` → `public/placeholder.svg` exists; `projects: ["janus"]` → `content/projects/janus` exists.)

```bash
pnpm content:qa
```

- [ ] Verify the new project-slug check actually fails on bad data. Temporarily edit `content/students/ararat-petrosyan/en.mdx`, changing the `projects` item from `- "janus"` to `- "does-not-exist"`, then run QA. Expected: exit 1 and stderr includes `- students/ararat-petrosyan/en.mdx: projects slug "does-not-exist" does not resolve to content/projects/does-not-exist`.

```bash
pnpm content:qa; echo "exit=$?"
```

- [ ] Revert the project-slug edit (restore `- "janus"`), then verify the photo check fails on bad data. Temporarily edit `content/students/ararat-petrosyan/en.mdx`, changing `photo: "/placeholder.svg"` to `photo: "/students/missing.jpg"`, then run QA. Expected: exit 1 and stderr includes `- students/ararat-petrosyan/en.mdx: photo asset not found at public/students/missing.jpg`.

```bash
pnpm content:qa; echo "exit=$?"
```

- [ ] Revert all temporary edits, then confirm QA passes again. Expected: `Content QA checks passed.`, exit 0.

```bash
git checkout content/students/ararat-petrosyan/en.mdx && pnpm content:qa
```

- [ ] Commit:

```bash
git add scripts/content-qa.mjs
git commit -m "feat(students): validate student photo paths and project slug references in content QA

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 8: Update README + final verification (full pipeline green + manual preview checklist)

**Files:**
- Modify: `/Users/grishakhachatryan/Desktop/Armath/ArmathArapi_website/ArmathArapi-website/README.md` (add a short Students directory mention — the spec lists this under Modified, marked optional)

**Interfaces:** Consumes the entire feature (Tasks 1–7). Produces a documented README, a green `lint + typecheck + build + content:qa` run, and a confirmed manual preview.

The README update closes the last listed spec item (line 240). The repo's `pnpm test` script enumerates only API/e2e test files (no content/component tests), and this feature adds none. Run the four feature-relevant gates explicitly rather than `pnpm ci`, to avoid coupling success to unrelated API/e2e suites — but if the team requires the full gate, `pnpm ci` should also pass since nothing here touches API/e2e code.

- [ ] Read `README.md` to find where features/content pipelines are documented (e.g. a "Content" or "Projects" section). Identify the closest existing prose describing the MDX content pipeline.

- [ ] Add a concise Students directory mention adjacent to the existing content/projects documentation. Adapt the wording to match the README's existing voice and heading structure; the mention MUST convey: students are curated MDX under `content/students/<slug>/{en,hy}.mdx` with a photo under `public/students/`; they surface as a homepage grid (`#students`) and per-student profile pages at `/students/[slug]`; and content is validated by `pnpm content:qa`. Example phrasing to integrate (do not paste verbatim if it does not fit the surrounding structure):

```md
### Students directory

Student profiles are curated MDX, mirroring the Projects pipeline. Each student
lives in `content/students/<slug>/en.mdx` + `hy.mdx` with an optional photo under
`public/students/` (falls back to `/placeholder.svg`). They render as a photo grid
on the homepage (`#students`) and as profile pages at `/students/[slug]`. Run
`pnpm content:qa` to validate locale pairs, required fields, linked project slugs,
and photo paths.
```

- [ ] Run lint. Expected: exits 0, no errors reported for the new/modified files.

```bash
pnpm lint
```

- [ ] Run typecheck. Expected: exits 0, no output.

```bash
pnpm typecheck
```

- [ ] Run the build. Expected: completes successfully; route list includes `/students/[slug]` and the homepage `/`; contentlayer logs Student documents generated.

```bash
pnpm build
```

- [ ] Run content QA. Expected stdout: `Content QA checks passed.`, exit 0.

```bash
pnpm content:qa
```

- [ ] (Optional, if running the full gate) Run the aggregate CI script. Expected: all of `lint`, `typecheck`, `test`, `build`, `content:qa` pass; final line from content QA is `Content QA checks passed.`

```bash
pnpm ci
```

- [ ] Start the dev server for manual preview.

```bash
pnpm dev
```

- [ ] Manual preview checklist (perform in a browser against the dev server):
  - [ ] On the homepage, scroll to the Students section (heading reads "Students" in EN). The seed student photo renders in the grid.
  - [ ] Desktop width: hovering a photo reveals the brand-gradient overlay with the student's name ("Ararat Petrosyan"); the mobile caption is NOT shown.
  - [ ] Mobile width (narrow the viewport below the `md` breakpoint): the name shows as an always-visible caption beneath the photo; the hover overlay is NOT used.
  - [ ] Clicking a photo navigates to `/students/ararat-petrosyan`; the profile renders photo, name, tagline, basics chips (grade + joined), interests/skills badges, the MDX bio, the linked Janus project card (CTA reads "View Project", with a visible gap between the image and the title), achievements list, and the GitHub link (opens in a new tab).
  - [ ] The profile back link goes to `/#students` and scrolls to the homepage Students section.
  - [ ] The Header nav shows a "Students" item (between "Our Projects" and "Support Armath") in both desktop and mobile menus; clicking it scrolls to `#students`.
  - [ ] Toggle the language to Armenian: the section title becomes "Աշակերտներ", the nav item, the student name, tagline, chips, bio, and achievements all switch to the `hy.mdx` content; the linked project card CTA reads "Դիտել նախագիծը" and the card still resolves. Confirm NO English text leaks into the Armenian view (this is the runtime symptom of a missing `hy` translation key from Task 2).
  - [ ] Navigate to a non-existent slug (e.g. `/students/nope`) and confirm the Next.js not-found page renders (via the `notFound()` guard).

- [ ] Stop the dev server (Ctrl-C in its terminal).

- [ ] Commit the README update:

```bash
git add README.md
git commit -m "docs(students): document the Students directory content pipeline

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
