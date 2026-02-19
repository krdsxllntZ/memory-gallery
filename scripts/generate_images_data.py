from __future__ import annotations

import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


WORKSPACE_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_IMAGES_DIR = WORKSPACE_ROOT / "public" / "images"
OUTPUT_TS = WORKSPACE_ROOT / "src" / "data" / "imagesData.ts"

CATEGORY_ORDER = ["CH", "MT", "M4", "M5", "M6"]
ALLOWED_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


@dataclass(frozen=True)
class Item:
  category: str
  label: str
  src: str


_num_re = re.compile(r"(\d+)")


def natural_key(s: str):
  return [int(part) if part.isdigit() else part.lower() for part in _num_re.split(s)]


def iter_images(category_dir: Path) -> Iterable[Path]:
  for p in category_dir.rglob("*"):
    if not p.is_file():
      continue
    if p.suffix.lower() not in ALLOWED_EXTS:
      continue
    yield p


def main() -> int:
  if not PUBLIC_IMAGES_DIR.exists():
    raise SystemExit(f"Missing folder: {PUBLIC_IMAGES_DIR}")

  items: list[Item] = []
  warnings: list[str] = []

  for cat in CATEGORY_ORDER:
    cat_dir = PUBLIC_IMAGES_DIR / cat
    if not cat_dir.exists():
      warnings.append(f"Missing category folder: {cat_dir}")
      continue

    files = sorted(iter_images(cat_dir), key=lambda p: natural_key(p.name))
    for f in files:
      label = f.stem
      # src must be a web path from /public
      rel = f.relative_to(WORKSPACE_ROOT / "public").as_posix()
      src = f"/{rel}"

      # basic sanity checks (non-fatal)
      if not (label.upper().startswith(f"{cat}_") or label.upper().startswith(f"{cat}-")):
        warnings.append(f"Label '{label}' in {cat} does not start with '{cat}_' or '{cat}-'")

      items.append(Item(category=cat, label=label, src=src))

  # Uniqueness check
  seen: set[str] = set()
  dupes: list[str] = []
  for it in items:
    key = it.label
    if key in seen:
      dupes.append(key)
    else:
      seen.add(key)
  if dupes:
    warnings.append(f"Duplicate labels found: {', '.join(sorted(set(dupes), key=natural_key))}")

  # Write TS file
  OUTPUT_TS.parent.mkdir(parents=True, exist_ok=True)

  lines: list[str] = []
  lines.append('export type ImageCategory = "CH" | "MT" | "M4" | "M5" | "M6"\n')
  lines.append("export interface GalleryImage {\n")
  lines.append("  id: string\n")
  lines.append("  category: ImageCategory\n")
  lines.append("  label: string\n")
  lines.append("  src: string\n")
  lines.append("}\n\n")
  lines.append("export const imagesData: GalleryImage[] = [\n")

  for cat in CATEGORY_ORDER:
    cat_items = [it for it in items if it.category == cat]
    if not cat_items:
      continue
    if cat == "CH":
      lines.append("  // CH = Childhood\n")
    elif cat == "MT":
      lines.append("  // MT = ม.ต้น\n")
    else:
      lines.append(f"  // {cat}\n")

    for it in cat_items:
      lines.append("  {\n")
      lines.append(f'    id: "{it.label}",\n')
      lines.append(f'    category: "{it.category}",\n')
      lines.append(f'    label: "{it.label}",\n')
      lines.append(f'    src: "{it.src}",\n')
      lines.append("  },\n")
    lines.append("\n")

  lines.append("]\n")

  OUTPUT_TS.write_text("".join(lines), encoding="utf-8")

  print(f"Wrote {OUTPUT_TS} with {len(items)} images.")
  if warnings:
    print("\nWarnings:")
    for w in warnings[:50]:
      print(f"- {w}")
    if len(warnings) > 50:
      print(f"- ... and {len(warnings) - 50} more")

  return 0


if __name__ == "__main__":
  raise SystemExit(main())

