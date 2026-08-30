from __future__ import annotations

import json
import random
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public" / "mbti-z"
HOUSE_DIR = PUBLIC_DIR / "houses"
ANIMAL_DIR = PUBLIC_DIR / "animals"
DATA_MODULE_URI = (ROOT / "data" / "mbti" / "mbti-z-data.mjs").as_uri()


def load_payload() -> dict:
    script = f"""
      import {{ mbtiZProfiles, mbtiZHouses }} from "{DATA_MODULE_URI}";
      console.log(JSON.stringify({{
        profiles: mbtiZProfiles.map((profile) => ({{
          code: profile.code,
          houseKey: profile.houseKey,
          houseTitleEn: profile.houseTitleEn,
          houseDescriptionEn: profile.houseDescriptionEn,
          accentFrom: profile.accentFrom,
          accentTo: profile.accentTo,
          animalKey: profile.animalKey,
          animalNameEn: profile.animalNameEn
        }})),
        houses: Object.values(mbtiZHouses)
      }}));
    """
    result = subprocess.run(
        ["node", "--input-type=module", "-e", script],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    return json.loads(result.stdout)


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[index : index + 2], 16) for index in (0, 2, 4))


def rgba(rgb: tuple[int, int, int], alpha: int) -> tuple[int, int, int, int]:
    return rgb[0], rgb[1], rgb[2], alpha


def lerp(left: float, right: float, amount: float) -> float:
    return left + (right - left) * amount


def lerp_color(
    left: tuple[int, int, int], right: tuple[int, int, int], amount: float
) -> tuple[int, int, int]:
    return tuple(int(lerp(lc, rc, amount)) for lc, rc in zip(left, right))


def build_gradient(
    size: tuple[int, int],
    top: tuple[int, int, int],
    mid: tuple[int, int, int],
    bottom: tuple[int, int, int],
) -> Image.Image:
    width, height = size
    image = Image.new("RGBA", size)
    draw = ImageDraw.Draw(image)

    for y in range(height):
        progress = y / max(height - 1, 1)
        if progress <= 0.55:
            color = lerp_color(top, mid, progress / 0.55)
        else:
            color = lerp_color(mid, bottom, (progress - 0.55) / 0.45)
        draw.line((0, y, width, y), fill=(*color, 255))

    return image


def add_grid(
    layer: Image.Image,
    spacing: int,
    color: tuple[int, int, int, int],
) -> None:
    draw = ImageDraw.Draw(layer)
    width, height = layer.size
    for x in range(0, width, spacing):
        draw.line((x, 0, x, height), fill=color, width=1)
    for y in range(0, height, spacing):
        draw.line((0, y, width, y), fill=color, width=1)


def add_particles(
    layer: Image.Image,
    seed: str,
    count: int,
    color: tuple[int, int, int],
) -> None:
    draw = ImageDraw.Draw(layer)
    width, height = layer.size
    rng = random.Random(seed)

    for _ in range(count):
        x = rng.randint(0, width)
        y = rng.randint(0, height)
        radius = rng.randint(1, 4)
        alpha = rng.randint(40, 160)
        draw.ellipse((x, y, x + radius, y + radius), fill=rgba(color, alpha))


def add_blur_orb(
    layer: Image.Image,
    center: tuple[int, int],
    radius: int,
    color: tuple[int, int, int],
    alpha: int,
) -> None:
    orb = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(orb)
    x, y = center
    draw.ellipse(
        (x - radius, y - radius, x + radius, y + radius),
        fill=rgba(color, alpha),
    )
    layer.alpha_composite(orb.filter(ImageFilter.GaussianBlur(radius // 2)))


def draw_arc_bundle(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    color: tuple[int, int, int, int],
    count: int,
    start: int,
    end: int,
    width: int,
) -> None:
    left, top, right, bottom = box
    for index in range(count):
        inset = index * 18
        draw.arc(
            (left + inset, top + inset, right - inset, bottom - inset),
            start=start,
            end=end,
            fill=color,
            width=max(width - index, 1),
        )


def draw_animal_motif(
    layer: Image.Image,
    animal_key: str,
    accent_from: tuple[int, int, int],
    accent_to: tuple[int, int, int],
) -> None:
    draw = ImageDraw.Draw(layer)
    width, height = layer.size
    center_x = width // 2
    center_y = int(height * 0.44)
    line_color = rgba(accent_to, 188)
    soft_color = rgba(accent_from, 124)

    if any(key in animal_key for key in ("raven", "owl", "phoenix", "eagle", "peacock", "swan")):
        draw_arc_bundle(
            draw,
            (center_x - 270, center_y - 180, center_x + 270, center_y + 280),
            line_color,
            4,
            204,
            336,
            7,
        )
        draw.line(
            (center_x, center_y - 180, center_x, center_y + 220),
            fill=soft_color,
            width=4,
        )
    elif any(key in animal_key for key in ("deer", "stag")):
        draw.line(
            (center_x, center_y - 150, center_x, center_y + 210),
            fill=line_color,
            width=6,
        )
        for direction in (-1, 1):
            draw.line(
                (
                    center_x,
                    center_y - 80,
                    center_x + direction * 180,
                    center_y - 210,
                    center_x + direction * 250,
                    center_y - 160,
                ),
                fill=line_color,
                width=5,
                joint="curve",
            )
            draw.line(
                (
                    center_x + direction * 70,
                    center_y - 30,
                    center_x + direction * 190,
                    center_y - 120,
                ),
                fill=soft_color,
                width=4,
            )
    elif any(key in animal_key for key in ("wolf", "fox", "lynx", "panther", "lion", "tiger", "bear", "rabbit")):
        draw.polygon(
            (
                center_x,
                center_y - 220,
                center_x - 160,
                center_y + 40,
                center_x,
                center_y + 260,
                center_x + 160,
                center_y + 40,
            ),
            outline=line_color,
            width=6,
        )
        draw.line(
            (center_x - 130, center_y - 30, center_x + 130, center_y - 30),
            fill=soft_color,
            width=5,
        )
        draw.line(
            (center_x - 90, center_y + 90, center_x, center_y + 150, center_x + 90, center_y + 90),
            fill=line_color,
            width=5,
            joint="curve",
        )


def build_house_scene(house: dict) -> Image.Image:
    width, height = 1600, 960
    accent_from = hex_to_rgb(house["accentFrom"])
    accent_to = hex_to_rgb(house["accentTo"])
    base = build_gradient((width, height), accent_from, (8, 11, 20), accent_to)

    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    add_grid(overlay, 96, rgba((130, 145, 180), 16))
    add_particles(overlay, house["key"], 180, (245, 248, 255))
    add_blur_orb(overlay, (int(width * 0.2), int(height * 0.34)), 180, accent_from, 110)
    add_blur_orb(overlay, (int(width * 0.82), int(height * 0.68)), 160, accent_to, 130)

    draw = ImageDraw.Draw(overlay)
    draw_arc_bundle(
        draw,
        (140, 120, width - 140, height - 80),
        rgba(accent_to, 70),
        5,
        204,
        330,
        4,
    )
    draw.rectangle(
        (0, int(height * 0.72), width, height),
        fill=rgba((4, 7, 14), 190),
    )
    draw.line(
        (
            0,
            int(height * 0.72),
            int(width * 0.3),
            int(height * 0.56),
            int(width * 0.52),
            int(height * 0.67),
            width,
            int(height * 0.44),
        ),
        fill=rgba(accent_from, 110),
        width=6,
        joint="curve",
    )

    base.alpha_composite(overlay.filter(ImageFilter.GaussianBlur(1)))
    return base.convert("RGB")


def build_type_poster(profile: dict) -> Image.Image:
    width, height = 1080, 1350
    accent_from = hex_to_rgb(profile["accentFrom"])
    accent_to = hex_to_rgb(profile["accentTo"])
    base = build_gradient((width, height), accent_from, (6, 9, 19), accent_to)

    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    add_grid(overlay, 84, rgba((125, 140, 172), 16))
    add_particles(overlay, profile["code"], 240, (245, 248, 255))
    add_blur_orb(overlay, (int(width * 0.26), int(height * 0.3)), 170, accent_from, 135)
    add_blur_orb(overlay, (int(width * 0.78), int(height * 0.72)), 220, accent_to, 150)

    draw = ImageDraw.Draw(overlay)
    draw.rounded_rectangle(
        (92, 84, width - 92, height - 84),
        radius=44,
        outline=rgba((255, 255, 255), 26),
        width=2,
    )
    draw_arc_bundle(
        draw,
        (124, 108, width - 124, height - 132),
        rgba(accent_to, 86),
        6,
        196,
        340,
        5,
    )
    draw_animal_motif(overlay, profile["animalKey"], accent_from, accent_to)

    vignette = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    vignette_draw = ImageDraw.Draw(vignette)
    vignette_draw.rectangle((0, 0, width, height), fill=(4, 8, 17, 0))
    vignette = vignette.filter(ImageFilter.GaussianBlur(42))

    base.alpha_composite(overlay.filter(ImageFilter.GaussianBlur(0)))
    base.alpha_composite(vignette)
    return base.convert("RGB")


def main() -> None:
    payload = load_payload()
    HOUSE_DIR.mkdir(parents=True, exist_ok=True)
    ANIMAL_DIR.mkdir(parents=True, exist_ok=True)

    houses = {entry["key"]: entry for entry in payload["houses"]}

    for house in houses.values():
        build_house_scene(house).save(HOUSE_DIR / f"{house['key']}.png", optimize=True)

    for profile in payload["profiles"]:
        poster = build_type_poster(profile)
        poster.save(
            ANIMAL_DIR / f"{profile['code'].lower()}-{profile['animalKey']}.png",
            optimize=True,
        )

    print("Generated MBTI Z house and type poster assets.")


if __name__ == "__main__":
    main()
