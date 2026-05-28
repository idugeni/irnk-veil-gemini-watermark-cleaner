# Chrome Web Store Readiness: IRNK Veil

## Extension Identity

| Field | Value |
|---|---|
| Name | IRNK Veil: Gemini Watermark Cleaner |
| Short name | IRNK Veil |
| Publisher | IRNK Codes |
| Homepage | https://irnk.codes/veil |
| Support | https://irnk.codes/support |
| Category | Productivity |
| Language | English primary |

## Short Description

Clean Gemini watermarks locally with precise visual processing by IRNK Codes.

## Detailed Description

IRNK Veil: Gemini Watermark Cleaner helps clean Gemini-generated images directly in your browser.

Built by IRNK Codes, IRNK Veil uses local visual processing to detect and refine Gemini watermark areas for a cleaner viewing and export workflow.

Key features:

- Cleans Gemini watermarks locally in the browser.
- Works automatically on supported Gemini pages.
- Provides a polished popup for status, settings, and statistics.
- Keeps image processing on-device.
- Uses scoped permissions for Gemini and related image resources.

Privacy-first workflow:

IRNK Veil processes image pixels locally in the browser. It does not upload user images to IRNK Codes servers.

## Single Purpose Statement

IRNK Veil cleans Gemini-generated image watermarks locally in the browser.

## Permission Justification

| Permission | Justification |
|---|---|
| `storage` | Stores local settings, enable/disable state, and cleanup statistics. |
| `declarativeNetRequest` | Blocks known watermark overlay image resources where applicable. |

## Host Permission Justification

| Host | Justification |
|---|---|
| `https://gemini.google.com/*` | Runs the cleanup workflow on Gemini pages. |
| `https://business.gemini.google/*` | Supports Gemini business workspace pages. |
| `https://aistudio.google.com/*` | Supports related Gemini image workflows where applicable. |
| `https://*.googleusercontent.com/*` | Accesses Gemini image resources required for local cleanup. |
| `https://googleusercontent.com/*` | Accesses Gemini image resources required for local cleanup. |
| `https://*.ggpht.com/*` | Accesses Gemini image resources required for local cleanup. |

## Data Usage Statement

IRNK Veil does not sell user data and does not transfer user images to IRNK Codes servers. Image cleanup is performed locally in the browser using on-device processing.

## Store Asset Checklist

Chrome Web Store assets to prepare in the dashboard:

- [ ] 128x128 icon from `public/icon/128.png`
- [ ] At least one 1280x800 screenshot
- [ ] Optional 440x280 small promo tile
- [ ] Optional 920x680 marquee promo tile
- [ ] Privacy policy URL on `irnk.codes`
- [ ] Support URL on `irnk.codes`
- [ ] Final ZIP built from `dist`

## Production Release Checklist

Before uploading to Chrome Web Store Developer Console:

- [ ] Run `npm run lint`
- [ ] Run `npm run typecheck`
- [ ] Run `npm run build`
- [ ] Inspect `dist/manifest.json`
- [ ] Load `dist` unpacked in Chrome
- [ ] Test popup branding
- [ ] Test Gemini page activation
- [ ] Test image cleanup flow
- [ ] Confirm no old visible branding remains
- [ ] Zip the contents of `dist`, not the project root

## Review Notes

Avoid using Google or Gemini logos in icons/screenshots unless they are part of the user-visible website context in a screenshot. The extension identity should remain clearly branded as IRNK Codes and should not imply official affiliation with Google or Gemini.
