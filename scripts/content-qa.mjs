#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import process from "node:process"

const root = process.cwd()
const contentRoot = path.join(root, "content")
const publicRoot = path.join(root, "public")
const locales = ["en", "hy"]
const errors = []

const docTypeConfig = {
  events: {
    requiredKeys: ["id", "title", "year", "date", "category", "location", "image"],
  },
  projects: {
    requiredKeys: ["id", "title", "year", "category", "image"],
  },
  materials: {
    requiredKeys: ["id", "title", "summary", "topic", "difficulty", "format", "ageGroup", "durationMinutes", "year", "image"],
  },
  students: {
    requiredKeys: ["id", "name"],
  },
}

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8")
}

function parseFrontmatter(source, filePath) {
  if (!source.startsWith("---\n")) {
    errors.push(`${filePath}: missing frontmatter start delimiter`)
    return null
  }

  const endIndex = source.indexOf("\n---\n", 4)
  if (endIndex === -1) {
    errors.push(`${filePath}: missing frontmatter end delimiter`)
    return null
  }

  return source.slice(4, endIndex)
}

function hasFrontmatterKey(frontmatter, key) {
  const regex = new RegExp(`^${key}:`, "m")
  return regex.test(frontmatter)
}

function getFrontmatterScalar(frontmatter, key) {
  const regex = new RegExp(`^${key}:\\s*["']?([^\\n"']+)["']?\\s*$`, "m")
  const match = frontmatter.match(regex)
  return match?.[1]?.trim() || null
}

function validateLocalePair(typeDir, slugDirName) {
  const slugPath = path.join(typeDir, slugDirName)
  const files = Object.fromEntries(
    locales.map((locale) => [locale, path.join(slugPath, `${locale}.mdx`)]),
  )

  for (const locale of locales) {
    if (!fs.existsSync(files[locale])) {
      errors.push(`${path.relative(root, slugPath)}: missing ${locale}.mdx`)
    }
  }

  if (!locales.every((locale) => fs.existsSync(files[locale]))) {
    return
  }

  const ids = new Map()

  for (const locale of locales) {
    const filePath = files[locale]
    const source = readFile(filePath)
    const frontmatter = parseFrontmatter(source, path.relative(root, filePath))
    if (!frontmatter) continue

    if (hasFrontmatterKey(frontmatter, "language")) {
      errors.push(`${path.relative(root, filePath)}: remove frontmatter key "language" (computed by contentlayer)`)
    }

    const typeName = path.basename(typeDir)
    const { requiredKeys } = docTypeConfig[typeName]
    for (const key of requiredKeys) {
      if (!hasFrontmatterKey(frontmatter, key)) {
        errors.push(`${path.relative(root, filePath)}: missing required frontmatter key "${key}"`)
      }
    }

    const id = getFrontmatterScalar(frontmatter, "id")
    if (id) {
      ids.set(locale, id)
    }

    const imagePath = getFrontmatterScalar(frontmatter, "image")
    if (imagePath && imagePath.startsWith("/")) {
      const assetPath = path.join(publicRoot, imagePath.slice(1))
      if (!fs.existsSync(assetPath)) {
        errors.push(`${path.relative(root, filePath)}: image asset not found at public/${imagePath.slice(1)}`)
      }
    }
  }

  if (ids.size === locales.length) {
    const [enId, hyId] = [ids.get("en"), ids.get("hy")]
    if (enId !== hyId) {
      errors.push(`${path.relative(root, slugPath)}: locale id mismatch (en="${enId}", hy="${hyId}")`)
    }
  }
}

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
    const relativePath = path.relative(root, filePath)
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

for (const [contentType] of Object.entries(docTypeConfig)) {
  const typeDir = path.join(contentRoot, contentType)
  const slugs = fs
    .readdirSync(typeDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  for (const slug of slugs) {
    validateLocalePair(typeDir, slug)
    if (contentType === "students") {
      validateStudentExtras(typeDir, slug)
    }
  }
}

if (errors.length > 0) {
  console.error("Content QA checks failed:")
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log("Content QA checks passed.")
