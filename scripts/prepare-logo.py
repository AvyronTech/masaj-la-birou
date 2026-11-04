"""Export the approved raster logo concept for web and a 4K archive copy."""

from pathlib import Path
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "brand-private/benvora-grup-logo-v2-source.png"


def main():
    image = Image.open(SOURCE).convert("RGB")
    if image.size != (1254, 1254):
        raise ValueError(f"Unexpected logo source size: {image.size}")

    image.save(ROOT / "assets/brand-logo.webp", "WEBP", quality=91, method=6)

    # Keep the sculpted B as the focal point in small navigation and the intro.
    mark = image.crop((215, 120, 1015, 920)).resize((768, 768), Image.Resampling.LANCZOS)
    # The source has a baked teal background. Extract the warm metal pixels so
    # the emblem floats naturally over the intro and navigation backgrounds.
    alpha = Image.new("L", mark.size)
    def metal_opacity(red, green, blue):
        warm = max(0, min(1, (red - green - 1) / 35, (green - blue - 2) / 25))
        highlight = max(0, min(1, (red - 95) / 50)) if red >= green - 5 and green >= blue - 6 else 0
        return round(255 * max(warm, highlight))

    alpha.putdata([metal_opacity(r, g, b) for r, g, b in mark.get_flattened_data()])
    mark = mark.convert("RGBA")
    mark.putalpha(alpha)
    mark.save(ROOT / "assets/brand-mark.webp", "WEBP", quality=93, method=6)
    favicon = Image.new("RGBA", (192, 192), "#092b2b")
    favicon.alpha_composite(mark.resize((192, 192), Image.Resampling.LANCZOS))
    favicon.save(ROOT / "assets/favicon.png", "PNG", optimize=True)

    # Archive a true 4096 × 4096 px delivery file. Source detail is AI-rendered
    # at 1254 px, so this is a high-quality upscale, not a native 4K render.
    master = image.resize((4096, 4096), Image.Resampling.LANCZOS)
    master = master.filter(ImageFilter.UnsharpMask(radius=1.15, percent=105, threshold=3))
    master.save(ROOT / "brand-private/benvora-grup-logo-v2-4k.webp", "WEBP", quality=96, method=6)


if __name__ == "__main__":
    main()
