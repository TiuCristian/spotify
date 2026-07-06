import os
import re
import urllib.parse
import urllib.request
from urllib.error import HTTPError, URLError
from collections import deque

# =========================================================
# CONFIG
# =========================================================
START_URL = "https://nexlink.layoutdrop.com/demo/index.html"

# Local project folder
PROJECT_ROOT = r"C:\laragon\www\nexlink"

# Restrict crawling to this path prefix
ALLOWED_PREFIX = "https://nexlink.layoutdrop.com/demo/"

# Download these asset types
ASSET_EXTS = {
    ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico", ".avif",
    ".css", ".js",
    ".woff", ".woff2", ".ttf", ".eot", ".otf",
    ".mp4", ".webm", ".ogg", ".mp3", ".wav", ".json"
}

# Ignore these schemes
IGNORE_SCHEMES = ("javascript:", "mailto:", "tel:", "data:")

# =========================================================
# HELPERS
# =========================================================
def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)

def read_url(url: str) -> bytes:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Accept": "*/*"
        }
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()

def clean_token(s: str) -> str:
    return s.strip().strip('"').strip("'").strip()

def absolutize(ref: str, base_url: str) -> str:
    ref = clean_token(ref)
    if not ref:
        return ""
    low = ref.lower()
    if low.startswith(IGNORE_SCHEMES):
        return ""
    if ref.startswith("//"):
        return "https:" + ref
    return urllib.parse.urljoin(base_url, ref)

def normalize_url(url: str) -> str:
    """
    Normalize URL to reduce duplicates.
    Keeps query only for assets if present.
    """
    parsed = urllib.parse.urlparse(url)
    path = parsed.path or "/"

    # remove fragment
    fragment = ""
    query = parsed.query

    # normalize path
    path = re.sub(r"/+", "/", path)

    # keep query because some assets may depend on it
    return urllib.parse.urlunparse((
        parsed.scheme,
        parsed.netloc,
        path,
        parsed.params,
        query,
        fragment
    ))

def is_internal_html(url: str) -> bool:
    """
    True only for HTML pages inside the target folder.
    """
    if not url.startswith(ALLOWED_PREFIX):
        return False

    parsed = urllib.parse.urlparse(url)
    path = parsed.path.lower()

    # HTML pages only
    return path.endswith(".html")

def is_asset_url(url: str) -> bool:
    clean = url.split("#")[0]
    parsed = urllib.parse.urlparse(clean)
    path = parsed.path.lower()
    _, ext = os.path.splitext(path)
    return ext in ASSET_EXTS

def url_to_local_path(url: str) -> str:
    """
    Maps:
      https://nexlink.layoutdrop.com/demo/index.html
      -> C:\laragon\www\nexlink\index.html

      https://nexlink.layoutdrop.com/demo/assets/css/styles.css
      -> C:\laragon\www\nexlink\assets\css\styles.css
    """
    parsed = urllib.parse.urlparse(url)
    path = parsed.path.lstrip("/")

    marker = "demo/"
    if marker in path:
        path = path.split(marker, 1)[1]

    if not path:
        path = "index.html"

    # if URL ends with slash, save as index.html
    if path.endswith("/"):
        path += "index.html"

    return os.path.join(PROJECT_ROOT, *path.split("/"))

def save_file_from_url(url: str, force: bool = False) -> bool:
    dest = url_to_local_path(url)
    ensure_dir(os.path.dirname(dest))

    if os.path.exists(dest) and not force:
        print(f"SKIP (exists): {dest}")
        return True

    try:
        data = read_url(url)
        with open(dest, "wb") as f:
            f.write(data)
        print(f"OK   {url} -> {dest}")
        return True
    except HTTPError as e:
        print(f"FAIL HTTP {e.code}: {url}")
    except URLError as e:
        print(f"FAIL URL: {url} ({e})")
    except Exception as e:
        print(f"FAIL ???: {url} ({e})")
    return False

# =========================================================
# REGEX EXTRACTORS
# =========================================================
RE_ATTR_URL = re.compile(
    r'''(?:src|href|content|poster)\s*=\s*["']([^"']+)["']''',
    re.I
)

RE_SRCSET = re.compile(
    r'''srcset\s*=\s*["']([^"']+)["']''',
    re.I
)

RE_CSS_URL = re.compile(
    r'''url\(([^)]+)\)''',
    re.I
)

RE_STYLE_BLOCK = re.compile(
    r'''<style[^>]*>(.*?)</style>''',
    re.I | re.S
)

RE_SCRIPT_SRC = re.compile(
    r'''<script[^>]+src\s*=\s*["']([^"']+)["']''',
    re.I
)

RE_LINK_HREF = re.compile(
    r'''<link[^>]+href\s*=\s*["']([^"']+)["']''',
    re.I
)

def extract_from_html(html: str, page_url: str) -> tuple[set[str], set[str], set[str]]:
    """
    Returns:
      asset_urls, css_urls, html_page_urls
    """
    asset_urls = set()
    css_urls = set()
    html_urls = set()

    # Generic src/href/content/poster
    for raw in RE_ATTR_URL.findall(html):
        url = absolutize(raw, page_url)
        if not url:
            continue
        url = normalize_url(url)

        if is_internal_html(url):
            html_urls.add(url)
        elif is_asset_url(url):
            asset_urls.add(url)

    # srcset
    for block in RE_SRCSET.findall(html):
        parts = [p.strip() for p in block.split(",")]
        for part in parts:
            if not part:
                continue
            first = part.split()[0]
            url = absolutize(first, page_url)
            if not url:
                continue
            url = normalize_url(url)
            if is_asset_url(url):
                asset_urls.add(url)

    # inline style="background-image:url(...)"
    for raw in RE_CSS_URL.findall(html):
        url = absolutize(raw, page_url)
        if not url:
            continue
        url = normalize_url(url)
        if is_asset_url(url):
            asset_urls.add(url)

    # <style> blocks
    for css in RE_STYLE_BLOCK.findall(html):
        for raw in RE_CSS_URL.findall(css):
            url = absolutize(raw, page_url)
            if not url:
                continue
            url = normalize_url(url)
            if is_asset_url(url):
                asset_urls.add(url)

    # linked CSS
    for raw in RE_LINK_HREF.findall(html):
        url = absolutize(raw, page_url)
        if not url:
            continue
        url = normalize_url(url)
        if urllib.parse.urlparse(url).path.lower().endswith(".css"):
            css_urls.add(url)
            asset_urls.add(url)

    # external/local JS files
    for raw in RE_SCRIPT_SRC.findall(html):
        url = absolutize(raw, page_url)
        if not url:
            continue
        url = normalize_url(url)
        if urllib.parse.urlparse(url).path.lower().endswith(".js"):
            asset_urls.add(url)

    return asset_urls, css_urls, html_urls

def extract_from_css(css_text: str, css_url: str) -> set[str]:
    assets = set()
    for raw in RE_CSS_URL.findall(css_text):
        url = absolutize(raw, css_url)
        if not url:
            continue
        url = normalize_url(url)
        if is_asset_url(url):
            assets.add(url)
    return assets

# =========================================================
# MAIN CRAWL
# =========================================================
def main():
    ensure_dir(PROJECT_ROOT)

    to_visit = deque([normalize_url(START_URL)])
    visited_pages = set()

    all_pages = set()
    all_assets = set()
    all_css = set()

    # Crawl internal HTML pages
    while to_visit:
        page_url = to_visit.popleft()
        if page_url in visited_pages:
            continue

        visited_pages.add(page_url)
        all_pages.add(page_url)

        print(f"\nPAGE: {page_url}")

        try:
            html_bytes = read_url(page_url)
            html = html_bytes.decode("utf-8", errors="ignore")
        except Exception as e:
            print(f"PAGE FAIL: {page_url} ({e})")
            continue

        # Save page locally
        dest = url_to_local_path(page_url)
        ensure_dir(os.path.dirname(dest))
        with open(dest, "wb") as f:
            f.write(html_bytes)
        print(f"SAVED PAGE: {dest}")

        assets, css_urls, html_urls = extract_from_html(html, page_url)
        all_assets |= assets
        all_css |= css_urls

        print(f"  found assets: {len(assets)}")
        print(f"  found css:    {len(css_urls)}")
        print(f"  found pages:  {len(html_urls)}")

        for next_url in sorted(html_urls):
            if next_url not in visited_pages:
                to_visit.append(next_url)

    # Scan CSS for nested assets
    css_assets = set()
    for css_url in sorted(all_css):
        try:
            css_bytes = read_url(css_url)
            css_text = css_bytes.decode("utf-8", errors="ignore")
            found = extract_from_css(css_text, css_url)
            css_assets |= found
            print(f"SCANNED CSS: {css_url} | nested assets: {len(found)}")
        except Exception as e:
            print(f"CSS FAIL: {css_url} ({e})")

    all_assets |= css_assets

    # Download assets
    print(f"\nTotal pages saved:  {len(all_pages)}")
    print(f"Total assets found: {len(all_assets)}")
    print("\nDownloading assets...\n")

    ok = 0
    fail = 0
    for asset_url in sorted(all_assets):
        if save_file_from_url(asset_url):
            ok += 1
        else:
            fail += 1

    print(f"\nDone.")
    print(f"Pages saved:      {len(all_pages)}")
    print(f"Assets success:   {ok}")
    print(f"Assets failed:    {fail}")

    if fail:
        print("Some files may be blocked, missing, hotlink-protected, or loaded dynamically by JS.")

if __name__ == "__main__":
    main()