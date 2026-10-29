#!/usr/bin/env python3
"""Regenerate data/publications.js from ORCID + Crossref.

Usage (from the site folder or anywhere):
    python3 tools/update_publications.py            # write data/publications.js
    python3 tools/update_publications.py --dry-run  # only print what would change

Corrections, works missing from ORCID and exclusions live in data/publications_extra.json.
Only the Python standard library is used.
"""
import argparse
import difflib
import html
import json
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXTRA = ROOT / "data" / "publications_extra.json"
OUT = ROOT / "data" / "publications.js"
UA = "personal-site-publications-updater/1.0 (+https://orcid.org)"

TYPE_MAP = {
    "journal-article": "article",
    "proceedings-article": "conference",
    "conference-paper": "conference",
    "book-chapter": "chapter",
    "posted-content": "preprint",
    "preprint": "preprint",
}


def get_json(url, accept="application/json", retries=3):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": accept})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            if attempt == retries - 1:
                raise
        except urllib.error.URLError:
            if attempt == retries - 1:
                raise
        time.sleep(1.5 * (attempt + 1))
    return None


def orcid_dois(orcid):
    data = get_json(f"https://pub.orcid.org/v3.0/{orcid}/works")
    dois = []
    for group in data.get("group", []):
        for summary in group.get("work-summary", []):
            ids = (summary.get("external-ids") or {}).get("external-id", [])
            doi = next((i["external-id-value"] for i in ids if i["external-id-type"] == "doi"), None)
            if doi:
                dois.append(doi.strip().lower())
                break
    return dois


def from_crossref(doi):
    data = get_json("https://api.crossref.org/works/" + urllib.parse.quote(doi))
    if not data:
        return None
    m = data["message"]
    year = ((m.get("issued") or {}).get("date-parts") or [[None]])[0][0]
    return {
        "doi": doi,
        "year": year,
        "type": TYPE_MAP.get(m.get("type"), "article"),
        "title": html.unescape(" ".join((m.get("title") or [""])[0].split())),
        "authors": [[a.get("given", ""), a.get("family", a.get("name", ""))] for a in m.get("author", [])],
        "venue": html.unescape((m.get("container-title") or [""])[0]),
        "volume": m.get("volume"),
        "issue": m.get("issue"),
        "pages": m.get("page") or m.get("article-number"),
        "cites": m.get("is-referenced-by-count") or 0,
    }


def from_datacite(doi):
    data = get_json("https://api.datacite.org/dois/" + urllib.parse.quote(doi), accept="application/vnd.api+json")
    if not data:
        return None
    a = data["data"]["attributes"]
    return {
        "doi": doi,
        "year": a.get("publicationYear"),
        "type": "preprint",
        "title": a["titles"][0]["title"],
        "authors": [[c.get("givenName", ""), c.get("familyName", c.get("name", ""))] for c in a.get("creators", [])],
        "venue": a.get("publisher") or "",
        "volume": None, "issue": None, "pages": None,
        "cites": a.get("citationCount") or 0,
    }


def clean_title(t):
    t = re.sub(r"^[A-Z]{1,3}\d+(-\d+)?\s*[–-]\s*", "", t)      # abstract codes like "A0935 – "
    t = re.sub(r"\s*\(Preprint\)\s*$", "", t, flags=re.I)
    if t.isupper():
        t = t.capitalize()
    return t


def norm_title(t):
    return re.sub(r"[^a-z0-9 ]", "", clean_title(t).lower())


def clean_authors(authors, fixes):
    out, seen = [], set()
    for given, family in authors:
        family = fixes.get(family, family)
        ascii_family = unicodedata.normalize("NFKD", family).encode("ascii", "ignore").decode().lower()
        key = (given[:1].lower(), re.sub(r"[^a-z]", "", ascii_family))
        if key in seen:
            continue
        seen.add(key)
        out.append([given.strip(), family.strip()])
    return out


def is_me(author):
    return bool(re.search(r"alzate|álzate", author[1], re.I))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true", help="print the result without writing the file")
    args = ap.parse_args()

    extra = json.loads(EXTRA.read_text(encoding="utf-8"))
    overrides = {k.lower(): v for k, v in extra.get("overrides", {}).items()}
    exclude = {d.lower() for d in extra.get("exclude", [])}
    fixes = extra.get("author_fixes", {})

    print(f"ORCID {extra['orcid']}…", file=sys.stderr)
    dois = orcid_dois(extra["orcid"])
    dois += [d.lower() for d in extra.get("extra_dois", []) if d.lower() not in dois]

    works = []
    for doi in dois:
        if doi in exclude:
            continue
        w = from_crossref(doi) or from_datacite(doi)
        if not w:
            print(f"  ! sin metadatos: {doi}", file=sys.stderr)
            continue
        works.append(w)
        print(f"  ✓ {doi}", file=sys.stderr)

    for m in extra.get("manual", []):
        w = {"volume": None, "issue": None, "pages": None, "cites": 0, **m}
        if w.get("doi"):
            w["doi"] = w["doi"].lower()
        works = [x for x in works if x["doi"] != w.get("doi")]
        works.append(w)

    for w in works:
        w.update(overrides.get(w.get("doi") or "", {}))
        w["title"] = clean_title(w["title"])
        w["authors"] = clean_authors(w["authors"], fixes)
        if "first" not in w:
            w["first"] = bool(w["authors"]) and is_me(w["authors"][0])

    # Drop a preprint when the same work also appears as a published version.
    published = [w for w in works if w["type"] != "preprint"]
    kept = []
    for w in works:
        if w["type"] == "preprint" and any(
            difflib.SequenceMatcher(None, norm_title(w["title"]), norm_title(p["title"])).ratio() > 0.9 for p in published
        ):
            print(f"  – preprint duplicado omitido: {w['title'][:70]}", file=sys.stderr)
            continue
        kept.append(w)

    keys = ["doi", "year", "type", "title", "authors", "venue", "volume", "issue", "pages", "cites", "first", "note"]
    kept = [{k: w.get(k) for k in keys if w.get(k) is not None or k == "doi"} for w in kept]
    kept.sort(key=lambda p: (-(p["year"] or 0), -p.get("cites", 0), p["title"]))

    old = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
    old_n = old.count('"title"')
    body = json.dumps(kept, ensure_ascii=False, indent=1)
    text = (f"/* Generated by tools/update_publications.py on {date.today().isoformat()} from ORCID "
            f"{extra['orcid']} + Crossref. Citation counts are Crossref \"is-referenced-by\". */\n"
            f"window.PUBLICATIONS = {body};\n")

    total = sum(p.get("cites", 0) for p in kept)
    print(f"\n{len(kept)} publicaciones (antes {old_n}) · {total} citas", file=sys.stderr)
    if args.dry_run:
        return
    OUT.write_text(text, encoding="utf-8")
    print(f"Escrito {OUT.relative_to(ROOT)}", file=sys.stderr)


if __name__ == "__main__":
    main()
