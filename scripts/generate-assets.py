from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import shutil

ROOT = Path(__file__).resolve().parents[1]
ICON_DIR = ROOT / "public" / "icon"
ICON = ICON_DIR / "v.png" if (ICON_DIR / "v.png").exists() else ICON_DIR / "512.png"
STORE_SHOTS = ROOT / "assets" / "store" / "screenshots"
STORE_PROMO = ROOT / "assets" / "store" / "promotional"
STORE_ICONS = ROOT / "assets" / "store" / "icons"
GITHUB = ROOT / "assets" / "github"

BG = (244, 240, 231)
SURFACE = (238, 232, 220)
SURFACE_DARK = (225, 216, 200)
TEXT = (48, 52, 59)
MUTED = (125, 116, 104)
GOLD = (255, 196, 0)
GOLD_DARK = (221, 153, 0)
GREEN = (78, 159, 93)
WHITE = (255, 255, 255)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except Exception:
            continue
    return ImageFont.load_default()


def ensure_dirs() -> None:
    for path in [STORE_SHOTS, STORE_PROMO, STORE_ICONS, GITHUB]:
        path.mkdir(parents=True, exist_ok=True)


def text_size(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.ImageFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def rounded_shadow(draw_base: Image.Image, box: tuple[int, int, int, int], radius: int = 36, fill=SURFACE, shadow=True) -> None:
    if shadow:
        shadow_layer = Image.new("RGBA", draw_base.size, (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow_layer)
        x1, y1, x2, y2 = box
        sd.rounded_rectangle((x1 + 18, y1 + 18, x2 + 18, y2 + 18), radius, fill=(160, 145, 122, 70))
        sd.rounded_rectangle((x1 - 18, y1 - 18, x2 - 18, y2 - 18), radius, fill=(255, 255, 255, 150))
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(18))
        draw_base.alpha_composite(shadow_layer)
    ImageDraw.Draw(draw_base).rounded_rectangle(box, radius, fill=fill, outline=(255, 255, 255, 135), width=2)


def background(size: tuple[int, int]) -> Image.Image:
    w, h = size
    img = Image.new("RGBA", size, BG + (255,))
    draw = ImageDraw.Draw(img)
    for r, alpha in [(520, 46), (360, 38), (220, 35)]:
        layer = Image.new("RGBA", size, (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        ld.ellipse((-r // 3, -r // 3, r, r), fill=GOLD + (alpha,))
        layer = layer.filter(ImageFilter.GaussianBlur(32))
        img.alpha_composite(layer)
    draw.rectangle((0, h - 10, w, h), fill=(232, 223, 207, 255))
    return img


def paste_logo(img: Image.Image, xy: tuple[int, int], size: int) -> None:
    logo = Image.open(ICON).convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    img.alpha_composite(logo, xy)


def draw_header(draw: ImageDraw.ImageDraw, img: Image.Image, title: str, subtitle: str, width: int) -> None:
    paste_logo(img, (72, 64), 88)
    draw.text((180, 70), title, font=font(42, True), fill=TEXT)
    draw.text((182, 122), subtitle, font=font(20), fill=MUTED)
    pill = (width - 300, 78, width - 72, 132)
    draw.rounded_rectangle(pill, 27, fill=(255, 246, 204), outline=(255, 255, 255), width=2)
    draw.ellipse((pill[0] + 24, pill[1] + 19, pill[0] + 38, pill[1] + 33), fill=GREEN)
    draw.text((pill[0] + 52, pill[1] + 16), "Store Ready", font=font(17, True), fill=TEXT)


def draw_popup_mock(img: Image.Image, x: int, y: int, scale: float = 1.0, settings: bool = False) -> None:
    w, h = int(360 * scale), int(500 * scale)
    rounded_shadow(img, (x, y, x + w, y + h), int(32 * scale), SURFACE)
    d = ImageDraw.Draw(img)
    paste_logo(img, (x + int(24 * scale), y + int(26 * scale)), int(52 * scale))
    d.text((x + int(90 * scale), y + int(28 * scale)), "IRNK Veil", font=font(int(22 * scale), True), fill=TEXT)
    d.text((x + int(92 * scale), y + int(58 * scale)), "Gemini Watermark Cleaner", font=font(int(11 * scale)), fill=MUTED)
    tabs = ["Status", "Settings", "Info"]
    for i, t in enumerate(tabs):
        bx = x + int(22 * scale) + i * int(104 * scale)
        by = y + int(102 * scale)
        fill = SURFACE_DARK if (settings and t == "Settings") or ((not settings) and t == "Status") else (246, 241, 232)
        d.rounded_rectangle((bx, by, bx + int(92 * scale), by + int(44 * scale)), int(18 * scale), fill=fill)
        tw, th = text_size(d, t, font(int(12 * scale), True))
        d.text((bx + (int(92 * scale) - tw) / 2, by + int(14 * scale)), t, font=font(int(12 * scale), True), fill=TEXT)
    card = (x + int(22 * scale), y + int(170 * scale), x + w - int(22 * scale), y + int(330 * scale))
    rounded_shadow(img, card, int(24 * scale), (242, 236, 225), shadow=False)
    if settings:
        d.text((card[0] + int(24 * scale), card[1] + int(22 * scale)), "Enable cleanup", font=font(int(18 * scale), True), fill=TEXT)
        d.text((card[0] + int(24 * scale), card[1] + int(54 * scale)), "Run on supported Gemini pages", font=font(int(12 * scale)), fill=MUTED)
        d.rounded_rectangle((card[2] - int(82 * scale), card[1] + int(32 * scale), card[2] - int(28 * scale), card[1] + int(62 * scale)), int(15 * scale), fill=(225, 216, 200))
        d.ellipse((card[2] - int(55 * scale), card[1] + int(36 * scale), card[2] - int(31 * scale), card[1] + int(60 * scale)), fill=GOLD)
        for n, label in enumerate(["Alpha threshold", "Max alpha"]):
            yy = card[1] + int((94 + n * 42) * scale)
            d.text((card[0] + int(24 * scale), yy), label, font=font(int(12 * scale), True), fill=TEXT)
            d.rounded_rectangle((card[0] + int(150 * scale), yy + int(5 * scale), card[2] - int(24 * scale), yy + int(15 * scale)), int(5 * scale), fill=(225, 216, 200))
            d.ellipse((card[0] + int((230 + n * 30) * scale), yy, card[0] + int((248 + n * 30) * scale), yy + int(18 * scale)), fill=GOLD)
    else:
        d.text((card[0] + int(24 * scale), card[1] + int(24 * scale)), "Cleaning ready", font=font(int(28 * scale), True), fill=TEXT)
        d.text((card[0] + int(24 * scale), card[1] + int(68 * scale)), "IRNK Veil is active on this Gemini tab.", font=font(int(13 * scale)), fill=MUTED)
        d.rounded_rectangle((card[0] + int(24 * scale), card[1] + int(108 * scale), card[0] + int(128 * scale), card[1] + int(138 * scale)), int(15 * scale), fill=(224, 238, 222))
        d.text((card[0] + int(42 * scale), card[1] + int(115 * scale)), "Private", font=font(int(12 * scale), True), fill=(62, 125, 73))
        d.ellipse((card[2] - int(74 * scale), card[1] + int(52 * scale), card[2] - int(38 * scale), card[1] + int(88 * scale)), fill=GREEN)
    for i, n in enumerate(["Cleaned", "Last", "Mask"]):
        bx = x + int(22 * scale) + i * int(105 * scale)
        by = y + int(352 * scale)
        rounded_shadow(img, (bx, by, bx + int(94 * scale), by + int(72 * scale)), int(18 * scale), (242, 236, 225), shadow=False)
        d.text((bx + int(16 * scale), by + int(14 * scale)), n, font=font(int(10 * scale), True), fill=MUTED)
        val = ["128", "09:42", "87%"][i]
        d.text((bx + int(16 * scale), by + int(34 * scale)), val, font=font(int(18 * scale), True), fill=TEXT)


def label_block(draw: ImageDraw.ImageDraw, x: int, y: int, title: str, body: str, max_width: int = 520) -> None:
    draw.text((x, y), title, font=font(54, True), fill=TEXT)
    lines = []
    words = body.split()
    current = ""
    for word in words:
        test = (current + " " + word).strip()
        if text_size(draw, test, font(24))[0] <= max_width:
            current = test
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    yy = y + 78
    for line in lines:
        draw.text((x, yy), line, font=font(24), fill=MUTED)
        yy += 36


def screenshot(path: Path, title: str, body: str, mode: str) -> None:
    img = background((1280, 800))
    d = ImageDraw.Draw(img)
    draw_header(d, img, "IRNK Veil", "Gemini Watermark Cleaner", 1280)
    label_block(d, 82, 252, title, body, 520)
    if mode == "settings":
        draw_popup_mock(img, 805, 180, 1.0, True)
    else:
        draw_popup_mock(img, 805, 180, 1.0, False)
    if mode in {"local", "workflow", "brand"}:
        card_y = 565
        items = {
            "local": [("Local", "Browser-only processing"), ("Private", "No image uploads"), ("Scoped", "Minimal permissions")],
            "workflow": [("Open", "Use Gemini"), ("Clean", "Local workflow"), ("Control", "Minimal popup")],
            "brand": [("IRNK", "Codes publisher"), ("MV3", "Chrome-ready"), ("1.0", "Production release")],
        }[mode]
        for i, (a, b) in enumerate(items):
            x = 82 + i * 210
            rounded_shadow(img, (x, card_y, x + 180, card_y + 98), 26, (242, 236, 225), shadow=False)
            d.text((x + 24, card_y + 22), a, font=font(24, True), fill=TEXT)
            d.text((x + 24, card_y + 58), b, font=font(14), fill=MUTED)
    img.convert("RGB").save(path)


def promo(path: Path, size: tuple[int, int], title: str, subtitle: str) -> None:
    img = background(size)
    d = ImageDraw.Draw(img)
    w, h = size
    logo_size = max(72, min(h // 2, 180))
    paste_logo(img, (int(w * 0.07), int(h * 0.18)), logo_size)
    x = int(w * 0.07) + logo_size + int(w * 0.04)
    y = int(h * 0.22)
    d.text((x, y), title, font=font(max(28, h // 9), True), fill=TEXT)
    d.text((x, y + max(42, h // 6)), subtitle, font=font(max(16, h // 22)), fill=MUTED)
    d.rounded_rectangle((x, h - int(h * 0.24), x + int(w * 0.28), h - int(h * 0.11)), int(h * 0.06), fill=(255, 246, 204))
    d.text((x + 24, h - int(h * 0.205)), "Built by IRNK Codes", font=font(max(13, h // 28), True), fill=TEXT)
    img.convert("RGB").save(path)


def github_asset(path: Path, size: tuple[int, int], title: str, subtitle: str, feature: str | None = None) -> None:
    img = background(size)
    d = ImageDraw.Draw(img)
    w, h = size
    paste_logo(img, (72, max(42, h // 2 - 72)), min(144, h - 120))
    x = 250
    d.text((x, h // 2 - 92), title, font=font(min(58, h // 7), True), fill=TEXT)
    d.text((x + 2, h // 2 - 20), subtitle, font=font(min(25, h // 22)), fill=MUTED)
    if feature:
        rounded_shadow(img, (w - 430, h // 2 - 92, w - 72, h // 2 + 92), 36, (242, 236, 225), shadow=True)
        d.text((w - 390, h // 2 - 46), feature, font=font(min(32, h // 14), True), fill=TEXT)
        d.text((w - 390, h // 2 + 6), "Warm minimal neumorphism", font=font(min(17, h // 28)), fill=MUTED)
    img.convert("RGB").save(path)


def manifest() -> None:
    rows = [
        ("assets/store/screenshots/screenshot-01-status.png", "1280x800", "Chrome Web Store screenshot"),
        ("assets/store/screenshots/screenshot-02-settings.png", "1280x800", "Chrome Web Store screenshot"),
        ("assets/store/screenshots/screenshot-03-local-first.png", "1280x800", "Chrome Web Store screenshot"),
        ("assets/store/screenshots/screenshot-04-workflow.png", "1280x800", "Chrome Web Store screenshot"),
        ("assets/store/screenshots/screenshot-05-brand.png", "1280x800", "Chrome Web Store screenshot"),
        ("assets/store/promotional/small-promo-tile.png", "440x280", "Small promo tile"),
        ("assets/store/promotional/marquee-promo-tile.png", "1400x560", "Marquee promo tile"),
        ("assets/store/promotional/large-promo-tile.png", "920x680", "Large promo tile"),
        ("assets/store/icons/store-icon-128.png", "128x128", "Store icon"),
        ("assets/store/icons/store-icon-512.png", "512x512", "Store/social icon"),
        ("assets/github/social-preview.png", "1280x640", "GitHub social preview"),
        ("assets/github/repository-banner.png", "1600x500", "README banner"),
        ("assets/github/feature-local.png", "900x520", "README feature card"),
        ("assets/github/feature-minimal-ui.png", "900x520", "README feature card"),
        ("assets/github/feature-store-ready.png", "900x520", "README feature card"),
    ]
    content = ["# IRNK Veil Visual Asset Manifest", "", "Generated production-facing assets for Chrome Web Store and GitHub.", "", "| File | Size | Usage |", "|---|---:|---|"]
    for row in rows:
        content.append(f"| `{row[0]}` | {row[1]} | {row[2]} |")
    content += ["", "> IRNK Veil is an independent tool by IRNK Codes and is not affiliated with Google or Gemini.", ""]
    (ROOT / "assets" / "ASSET_MANIFEST.md").write_text("\n".join(content), encoding="utf-8")


def main() -> None:
    ensure_dirs()
    screenshots = [
        ("screenshot-01-status.png", "Clean Gemini watermarks locally", "A focused status view shows readiness, cleanup count, and local-first protection.", "status"),
        ("screenshot-02-settings.png", "Minimal controls, precise tuning", "Enable cleanup, tune precision, and manage settings from a calm neumorphic popup.", "settings"),
        ("screenshot-03-local-first.png", "Private on-device workflow", "Image cleanup runs in the browser without uploading user images to IRNK Codes servers.", "local"),
        ("screenshot-04-workflow.png", "Designed for Gemini workflows", "Open Gemini, keep IRNK Veil enabled, and control cleanup from the extension popup.", "workflow"),
        ("screenshot-05-brand.png", "Built by IRNK Codes", "Production-ready Chrome MV3 extension with scoped permissions and clean branding.", "brand"),
    ]
    for name, title, body, mode in screenshots:
        screenshot(STORE_SHOTS / name, title, body, mode)
    promo(STORE_PROMO / "small-promo-tile.png", (440, 280), "IRNK Veil", "Gemini Watermark Cleaner")
    promo(STORE_PROMO / "marquee-promo-tile.png", (1400, 560), "IRNK Veil", "Clean Gemini watermarks locally")
    promo(STORE_PROMO / "large-promo-tile.png", (920, 680), "IRNK Veil", "Private on-device cleanup")
    shutil.copyfile(ROOT / "public" / "icon" / "128.png", STORE_ICONS / "store-icon-128.png")
    Image.open(ICON).convert("RGBA").resize((512, 512), Image.Resampling.LANCZOS).save(STORE_ICONS / "store-icon-512.png")
    github_asset(GITHUB / "social-preview.png", (1280, 640), "IRNK Veil", "Gemini Watermark Cleaner by IRNK Codes", "Local-first cleanup")
    github_asset(GITHUB / "repository-banner.png", (1600, 500), "IRNK Veil", "Warm minimal Chrome extension for Gemini watermark cleanup", "Chrome MV3")
    github_asset(GITHUB / "feature-local.png", (900, 520), "Local-first", "Cleanup runs in your browser without image uploads.", "Private")
    github_asset(GITHUB / "feature-minimal-ui.png", (900, 520), "Minimal UI", "Neumorphic controls focused on status and settings.", "Warm design")
    github_asset(GITHUB / "feature-store-ready.png", (900, 520), "Store Ready", "Assets, docs, privacy, and release checklist prepared.", "Production")
    manifest()


if __name__ == "__main__":
    main()
