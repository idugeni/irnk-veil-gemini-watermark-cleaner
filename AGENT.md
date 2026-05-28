# AI Agent Guide: IRNK Veil

## Project Overview

IRNK Veil: Gemini Watermark Cleaner is a Chrome Manifest V3 extension by IRNK Codes. It cleans supported Gemini image watermarks locally in the browser with scoped permissions and fail-safe runtime behavior.

## Current Architecture

```text
src/
├── background/       # MV3 service worker source
├── build/            # build orchestration
├── popup/            # React popup UI
└── runtime/          # content/runtime modules

public/
├── icon/             # extension icons
└── rules/            # declarativeNetRequest rules
```

## Key Files

| File | Purpose |
|---|---|
| `manifest.json` | Chrome extension manifest |
| `src/background/index.ts` | Background service worker source |
| `src/runtime/content-main.js` | Main runtime content script |
| `src/runtime/isolated-bridge.js` | Isolated bridge runtime |
| `src/popup/App.tsx` | Popup shell and navigation |
| `src/popup/popup.css` | Popup design system |
| `vite.config.ts` | Vite and CRX build config |

## Development Rules

- Keep image processing local in the browser.
- Do not add analytics or image upload flows.
- Keep permissions scoped and justified.
- Preserve fail-safe behavior when processing fails.
- Keep UI minimal, accessible, and aligned with the IRNK Veil brand.
- Use `@/` imports for source files.

## Compatibility Notes

Some internal storage keys and message names retain legacy identifiers for migration compatibility:

- `gwc_settings`
- `gwc_stats`
- `gwrEnabled`
- `GWC_STATS_UPDATE`
- `GWC_SETTINGS_UPDATE`

Do not rename these without a migration plan.

## Validation

Run before completing work:

```bash
npm run lint
npm run typecheck
npm run build
```

## Manual Testing

1. Build with `npm run build`.
2. Open `chrome://extensions/`.
3. Enable Developer mode.
4. Load the `dist/` folder unpacked.
5. Test on supported Gemini pages.
6. Confirm settings persist and statistics update.
