
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]

REQUIRED = [
    "index.html",
    "mission-01.html",
    "css/styles.css",
    "js/main.js",
    "js/state.js",
    "js/storage.js",
    "js/ui.js",
    "js/mission-01.js",
    "student-app/index.html",
    "student-app/css/style.css",
    "student-app/assets/figma-reference.png",
    "docs/PRODUCT_BRIEF.md",
    "docs/DECISIONS.md",
    "tests/mission-01-test-cases.md",
    ".github/copilot-instructions.md",
    "README.md",
    ".gitignore",
]

errors = []

for name in REQUIRED:
    if not (ROOT / name).is_file():
        errors.append(f"Відсутній файл: {name}")

def check_html(path, require_module=False):
    file = ROOT / path

    if not file.is_file():
        return

    html = file.read_text(encoding="utf-8")

    if 'lang="uk"' not in html:
        errors.append(f"{path}: відсутній lang=\"uk\"")

    if require_module and 'type="module"' not in html:
        errors.append(f"{path}: відсутній type=\"module\"")

check_html("index.html", require_module=True)
check_html("mission-01.html")
check_html("student-app/index.html")

if errors:
    print("ПОМИЛКА ПЕРЕВІРКИ:")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print(f"OK: перевірено наявність {len(REQUIRED)} файлів.")
print("Базові HTML-ознаки перевірено.")
print(
    "Увага: це структурна перевірка, "
    "а не браузерний тест і не перевірка якості MVP."
)
