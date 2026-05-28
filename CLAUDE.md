# Claude Guide: IRNK Veil

## Project Identity

- **Name**: IRNK Veil: Gemini Watermark Cleaner
- **Publisher**: IRNK Codes
- **Type**: Chrome Extension Manifest V3
- **Purpose**: Clean supported Gemini image watermarks locally in the browser

## Core Principles

### 1. Check Extension Context

Before Chrome API calls, validate the extension context:

```typescript
function isContextValid(): boolean {
  try {
    return !!chrome.runtime?.id;
  } catch {
    return false;
  }
}
```

### 2. Preserve Local Processing

- Image processing must remain local in the browser.
- Do not add external image upload flows.
- Do not add analytics without explicit product approval.

### 3. Fail Safely

If processing fails, preserve the user's browsing session and return the original result where possible.

### 4. Keep Branding Clean

Use `IRNK Veil` for user-facing product references.

Legacy internal keys/messages may remain for compatibility, but should not appear as public branding.

## Build and Test Workflow

```bash
npm run lint
npm run typecheck
npm run build
```

After building, load `dist/` as an unpacked extension in `chrome://extensions/`.

## Key Files

| File | Purpose |
|---|---|
| `manifest.json` | Extension metadata and permissions |
| `src/background/index.ts` | Background service worker |
| `src/runtime/content-main.js` | Runtime content script |
| `src/popup/App.tsx` | Popup shell |
| `src/popup/components/tabs/SettingsTab.tsx` | Settings UI |
| `src/popup/popup.css` | Popup neumorphism design system |
| `docs/CHROME_WEB_STORE.md` | Store submission guide |

## UI Direction

The popup uses modern minimal neumorphism:

- warm ivory/sand surfaces,
- graphite text,
- gold accent aligned with the yellow `V` icon,
- minimal motion,
- action-first layout.

## Manual Testing Checklist

- [ ] Extension loads without console errors.
- [ ] Popup opens and settings persist.
- [ ] Supported Gemini page is detected.
- [ ] Statistics update after cleanup activity.
- [ ] Disabled state stops cleanup behavior.
- [ ] Production build can be loaded from `dist/`.
