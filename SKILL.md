# Technical Skills Reference: IRNK Veil

## Core Technologies

### Browser Extension

- Chrome Manifest V3
- Background service worker
- Content/runtime scripts
- Declarative Net Request rules
- Chrome local storage
- Scoped host permissions

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Minimal neumorphism popup UI

## Development Commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Extension Context Guard

Use a context guard before Chrome API calls that can run after reload/uninstall:

```typescript
function isContextValid(): boolean {
  try {
    return !!chrome.runtime?.id;
  } catch {
    return false;
  }
}
```

## Local Storage

IRNK Veil currently preserves these internal keys for compatibility:

```text
gwc_settings
gwc_stats
gwrEnabled
```

These are implementation details, not public branding.

## Runtime Messaging

Some message constants also remain for compatibility:

```text
GWC_STATS_UPDATE
GWC_SETTINGS_UPDATE
```

Do not rename them without migration work across runtime, popup, and background code.

## UI Direction

The popup UI should remain:

- minimal,
- warm,
- neumorphic,
- aligned with the yellow `V` logo,
- focused on status, settings, and product info.

Avoid reintroducing:

- heavy glassmorphism,
- cyan/violet primary themes,
- decorative scanlines,
- excessive animated backgrounds,
- static marketing-heavy tabs.

## Privacy and Security Requirements

- Keep image processing local in the browser.
- Do not upload user images to IRNK Codes servers.
- Keep permissions scoped to supported pages/resources.
- Preserve fail-safe runtime behavior.
- Avoid adding analytics by default.

## Manual Testing Checklist

- [ ] Build succeeds with `npm run build`.
- [ ] `dist/` loads in `chrome://extensions/`.
- [ ] Popup opens correctly.
- [ ] Gemini tab detection works.
- [ ] Settings persist across popup sessions.
- [ ] Statistics update after cleanup activity.
- [ ] Disabled mode stops cleanup behavior.
