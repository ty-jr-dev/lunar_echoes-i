#!/usr/bin/env python3
"""
validate_missions.py
Checks data/missions_data.json against the Lunar Echoes schema.

Usage (from the project root):
    python3 scripts/validate_missions.py
    python3 scripts/validate_missions.py --skip-files   # do not check image files

Exit code 0 = no errors (warnings are allowed), 1 = errors found.
"""
import json
import os
import re
import sys
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "missions_data.json")

BODIES = {"Moon", "Mars", "Deep Space"}
STATUSES = {"Abandoned", "Lost contact", "Active", "Retired"}
REQUIRED = [
    "id", "name", "body", "launch_year", "end_year", "status",
    "location_description", "summary", "technologies", "key_discoveries",
    "left_behind", "why_it_matters", "story", "images", "sources",
]
LIST_FIELDS = ["technologies", "key_discoveries", "left_behind"]
MAX_IMAGE_KB = 300
SUMMARY_MAX_WORDS = 20
STORY_MIN_WORDS, STORY_MAX_WORDS = 80, 120

errors, warnings = [], []


def err(mid, msg):
    errors.append(f"[{mid}] {msg}")


def warn(mid, msg):
    warnings.append(f"[{mid}] {msg}")


def words(text):
    return len(text.split())


def check_mission(m, index, skip_files, seen_ids):
    mid = m.get("id", f"#{index}")

    for field in REQUIRED:
        if field not in m:
            err(mid, f"missing field '{field}'")
    if any(f not in m for f in REQUIRED):
        return

    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", m["id"]):
        err(mid, "id must be kebab-case (lowercase letters, digits, hyphens)")
    if m["id"] in seen_ids:
        err(mid, "duplicate id")
    seen_ids.add(m["id"])

    if m["body"] not in BODIES:
        err(mid, f"body '{m['body']}' must be one of {sorted(BODIES)} (exact case)")
    if m["status"] not in STATUSES:
        err(mid, f"status '{m['status']}' must be one of {sorted(STATUSES)}")

    if not isinstance(m["launch_year"], int):
        err(mid, "launch_year must be a number")
    if m["end_year"] is not None and not isinstance(m["end_year"], int):
        err(mid, "end_year must be a number or null")
    if isinstance(m["launch_year"], int) and isinstance(m["end_year"], int) \
            and m["end_year"] < m["launch_year"]:
        err(mid, "end_year is earlier than launch_year")
    if m["status"] == "Active" and m["end_year"] is not None:
        warn(mid, "status is Active but end_year is not null")

    for field in ["name", "location_description", "summary", "why_it_matters", "story"]:
        if not isinstance(m[field], str) or not m[field].strip():
            err(mid, f"'{field}' must be a non-empty string")

    if isinstance(m["summary"], str) and words(m["summary"]) > SUMMARY_MAX_WORDS:
        err(mid, f"summary has {words(m['summary'])} words (max {SUMMARY_MAX_WORDS})")
    if isinstance(m["story"], str):
        n = words(m["story"])
        if not STORY_MIN_WORDS <= n <= STORY_MAX_WORDS:
            err(mid, f"story has {n} words (must be {STORY_MIN_WORDS}-{STORY_MAX_WORDS})")

    seen_items = {}
    for field in LIST_FIELDS:
        items = m[field]
        if not isinstance(items, list) or not items or not all(isinstance(i, str) and i.strip() for i in items):
            err(mid, f"'{field}' must be a non-empty list of strings")
            continue
        for item in items:
            key = item.strip().lower()
            if key in seen_items and seen_items[key] != field:
                warn(mid, f"'{item}' appears in both '{seen_items[key]}' and '{field}'")
            seen_items[key] = field

    if not isinstance(m["images"], list):
        err(mid, "'images' must be a list (it can be empty)")
    else:
        if not m["images"]:
            warn(mid, "no images yet")
        for i, img in enumerate(m["images"]):
            for k in ("src", "alt", "credit"):
                if not isinstance(img.get(k), str) or not img[k].strip():
                    err(mid, f"images[{i}] needs a non-empty '{k}'")
            src = img.get("src", "")
            if src.startswith(("http://", "https://", "/")):
                err(mid, f"images[{i}].src must be a relative local path, not '{src}'")
            elif src and not skip_files:
                path = os.path.join(ROOT, src)
                if not os.path.isfile(path):
                    err(mid, f"image file not found: {src}")
                else:
                    kb = os.path.getsize(path) / 1024
                    if kb > MAX_IMAGE_KB:
                        warn(mid, f"{src} is {kb:.0f} KB (max {MAX_IMAGE_KB} KB)")

    if not isinstance(m["sources"], list) or not m["sources"]:
        err(mid, "'sources' must be a non-empty list of URLs")
    else:
        for s in m["sources"]:
            u = urlparse(s)
            if u.scheme != "https" or not u.hostname:
                err(mid, f"source is not a valid https URL: {s}")
            elif not u.hostname.endswith("nasa.gov"):
                err(mid, f"source is not on a nasa.gov domain: {s}")
            if "utm_" in s:
                err(mid, f"remove the tracking parameter (utm_...) from: {s}")


def main():
    skip_files = "--skip-files" in sys.argv
    try:
        with open(DATA, encoding="utf-8") as fh:
            data = json.load(fh)
    except FileNotFoundError:
        print(f"File not found: {DATA}")
        return 1
    except json.JSONDecodeError as e:
        print(f"Invalid JSON: {e}")
        return 1

    if not isinstance(data, list):
        print("The root of missions_data.json must be a JSON array.")
        return 1

    seen = set()
    for i, m in enumerate(data):
        check_mission(m, i, skip_files, seen)

    counts = {}
    for m in data:
        counts[m.get("body", "?")] = counts.get(m.get("body", "?"), 0) + 1

    print(f"{len(data)} missions checked. By body: {counts}")
    if not 6 <= len(data) <= 10:
        warnings.append(f"[all] {len(data)} missions; the MVP asks for 6 to 10")
    for body in sorted(BODIES):
        if body not in counts:
            warnings.append(f"[all] no mission with body '{body}' (that filter will be empty)")

    for w in warnings:
        print("WARNING", w)
    for e in errors:
        print("ERROR  ", e)
    print(f"\n{len(errors)} error(s), {len(warnings)} warning(s).")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
