# Contributing

Thank you for your interest in IRNK Veil.

This repository is maintained by IRNK Codes. Contributions may be reviewed at IRNK Codes' discretion.

## Local Setup

```bash
npm install
```

## Development Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Quality Requirements

Before proposing changes, run:

```bash
npm run lint
npm run typecheck
npm run build
```

## Coding Guidelines

- Keep image processing local in the browser.
- Do not add analytics or external image upload flows.
- Keep permissions scoped and justified.
- Preserve fail-safe behavior for runtime processing.
- Keep UI minimal, accessible, and aligned with the IRNK Veil brand.
- Use the `@/` alias for imports from `src/`.

## Chrome Extension Testing

After building:

1. Open `chrome://extensions/`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select the `dist/` folder.
5. Test on supported Gemini pages.

## Pull Request Expectations

A change should include:

- clear summary,
- validation results,
- screenshots for UI changes,
- permission/privacy explanation for extension behavior changes.

## Trademark and Affiliation

Do not represent IRNK Veil as an official Google or Gemini product. IRNK Veil is an independent tool by IRNK Codes.
