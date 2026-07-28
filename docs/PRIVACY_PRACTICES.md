# Chrome Web Store — Privacy Practices Tab

Teks siap-tempel untuk tab **Praktik Privasi** di Chrome Web Store Developer Dashboard.

---

## 1. Single Purpose (Tujuan Tunggal)

```
IRNK Veil has a single purpose: to clean watermarks from Gemini-generated images locally inside the user's browser. The extension activates only on supported Gemini pages and the image CDNs that serve Gemini images, detects watermark regions, and applies on-device visual reconstruction so users can view and export cleaner images. No unrelated functionality is included.
```

## 2. Justification — `declarativeNetRequest`

```
declarativeNetRequest is used to apply a small, static rule set bundled with the extension (rules/block-watermark-images.json) that blocks known Gemini watermark overlay image requests at the network layer. This lets the extension prevent watermark resources from loading without using webRequest and without reading or modifying the contents of any other request. The ruleset is shipped inside the signed extension package and is not updated from any remote source.
```

## 3. Justification — Host Permissions (Izin Host)

```
Host permissions are scoped strictly to the URLs required by the cleanup workflow:

- https://gemini.google.com/* and https://business.gemini.google/*
  Inject the content script that detects Gemini-generated images on the page and triggers local cleanup.

- https://aistudio.google.com/*
  Supports related Gemini image surfaces on AI Studio.

- https://*.googleusercontent.com/*, https://googleusercontent.com/*, https://*.ggpht.com/*
  Gemini serves its generated images from these Google CDNs. Read access is required so the extension can fetch the image bytes and perform local pixel-level reconstruction in the browser.

The extension does not run on any other website.
```

## 4. Justification — Remote Code (Kode Jarak Jauh)

Pilih opsi **"No, I am not using Remote code"** lalu tempel:

```
This extension does not use remote code. All JavaScript, CSS, and JSON shipped to users is bundled into the extension package at build time using Vite (Manifest V3 production build). The extension does not load scripts from remote URLs, does not use eval() or new Function() on remotely fetched content, does not inject remotely hosted scripts, and does not pull modules from a CDN at runtime. Every executable file is contained in the signed extension ZIP uploaded to the Chrome Web Store.
```

## 5. Justification — `storage`

```
The storage permission is used to persist a small amount of user-controlled state in chrome.storage.local:

- extension enabled/disabled toggle,
- cleanup sensitivity setting,
- debug preference,
- local cleanup counters/statistics shown in the popup.

This data stays in the user's local browser profile. Nothing is transmitted to IRNK Codes servers or any third party.
```

## 6. Data Usage Compliance (Checkbox)

Centang ketiga pernyataan berikut:

- [x] I do not sell or transfer user data to third parties, outside of the approved use cases
- [x] I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes

Lalu klik **Save Draft**.

---

## Notes

- **Privacy policy URL**: isi dengan URL publik (contoh: `https://irnk.codes/veil/privacy`). Pastikan URL sudah online sebelum submit.
- Ekstensi ini tidak menggunakan `activeTab`, jadi tidak perlu justifikasi tambahan untuk permission tersebut.
