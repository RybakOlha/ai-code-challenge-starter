from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "index.html", "css/styles.css", "js/main.js", "js/state.js",
    "js/storage.js", "js/ui.js", "tests/test-cases.md",
    "docs/PRODUCT_BRIEF.md", "docs/DECISIONS.md",
    "docs/RELEASE_CHECKLIST.md", ".github/copilot-instructions.md",
    "README.md", ".gitignore",
]
missing = [name for name in REQUIRED if not (ROOT / name).is_file()]
html = (ROOT / "index.html").read_text(encoding="utf-8") if not missing else ""
if html and ('type="module"' not in html or 'lang="uk"' not in html):
    missing.append("HTML: потрібні lang=uk та type=module")
if missing:
    print("ПОМИЛКА:", *missing, sep="\n- ")
    sys.exit(1)
print(f"OK: {len(REQUIRED)} файлів; базові HTML-ознаки перевірено.")
print("Увага: це не браузерний тест і не перевірка MVP.")
