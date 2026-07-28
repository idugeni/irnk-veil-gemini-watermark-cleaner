# Changelog

All notable changes to IRNK Veil are documented here.

## [1.1.0] - 2026-07-29

### Fixed

- Watermark removal now works with Gemini 3.5 images (192px margin variant).
- 192px-margin fallback is tried for all images >= 288px, not just specific resolutions.

### Added

- AI Studio (`aistudio.google.com`) content script injection.
- Settings bridge: popup settings now propagate to the runtime engine in real-time.
- Stats tracking: processed image count and metadata flow from engine to popup.
- `npm run package` script for zip output.

### Changed

- CORS declarative net request rules now scoped with `initiatorDomains` (security hardening).
- Dependencies updated to latest stable versions (React 19.1, Vite 8.1, Tailwind 4.3.3, CRXJS 2.7.1).
- Removed canary React, autoprefixer, js-beautify, patch-package.
- Creator info in utils is now plain text (removed unnecessary base64 encoding).
- Popup Stats interface updated to reflect engine metadata (source, alphaGain, decisionTier).

## [1.0.0] - 2026-05-29

### Added

- Chrome Manifest V3 extension build.
- IRNK Veil product branding.
- Gemini-focused local watermark cleanup workflow.
- Minimal neumorphism popup UI.
- Local settings and cleanup statistics.
- declarativeNetRequest rules for blocking watermark image resources.
- Chrome Web Store readiness documentation.
- Privacy, security, contributing, and technical documentation.

### Notes

- IRNK Veil is an independent tool by IRNK Codes and is not affiliated with, endorsed by, or sponsored by Google or Gemini.
