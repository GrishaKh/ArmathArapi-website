# Content QA Checklist

Run this checklist before publishing new content entries.

## Required checks

1. Locale parity:
   - Each content slug has both `en.mdx` and `hy.mdx`.
   - `id` matches between locale files.
2. Frontmatter validity:
   - Frontmatter block exists and closes correctly.
   - Required keys exist:
     - Events: `id`, `title`, `year`, `date`, `category`, `location`, `image`
     - Projects: `id`, `title`, `year`, `category`, `image`
   - `language` is not manually set in frontmatter.
3. Asset existence:
   - Any `image: "/...` asset exists under `/public`.

## Automated command

```bash
pnpm run content:qa
```

This command validates locale parity, key frontmatter constraints, and asset existence.
