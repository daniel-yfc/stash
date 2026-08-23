#!/bin/bash
set -e

echo "=== 建立網站 ==="

# 1. 建立輸出目錄
mkdir -p site/

# 2. 複製靜態檔案
cp -r docs/ site/ 2>/dev/null || true
cp -r skills/ site/ 2>/dev/null || true
cp -r scrapers/ site/ 2>/dev/null || true
cp -r validator/ site/ 2>/dev/null || true

# 3. 產生 index.html
cat > site/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>stash-scraper-builder</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; }
    h1 { color: #333; }
    h2 { color: #666; margin-top: 2rem; }
    code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 5px; overflow-x: auto; }
    .file-list { list-style: none; padding: 0; }
    .file-list li { margin: 0.5rem 0; }
    .file-list a { color: #0366d6; text-decoration: none; }
    .file-list a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>stash-scraper-builder</h1>
  <p>StashApp 刮削器建立工具 + Agent Skill + 自製刮削器集合。</p>

  <h2>檔案結構</h2>
  <ul class="file-list">
    <li><a href="skills/stash-scraper-builder/SKILL.md">SKILL.md</a> — Agent 入口</li>
    <li><a href="validator/index-zh-TW.mjs">validator/index-zh-TW.mjs</a> — 中文化驗證器</li>
    <li><a href="scrapers/">scrapers/</a> — 自製刮削器</li>
  </ul>

  <h2>快速開始</h2>
  <pre><code># 驗證刮削器
deno run -R=scrapers -R=validator/scraper.schema.json validator/index-zh-TW.mjs -a -s scrapers/</code></pre>

  <h2>參考</h2>
  <ul>
    <li><a href="https://docs.stashapp.cc/in-app-manual/scraping/scraperdevelopment">Stash 刮削器開發文件</a></li>
    <li><a href="https://github.com/stashapp/CommunityScrapers">CommunityScrapers</a></li>
  </ul>
</body>
</html>
EOF

echo "=== 網站建立完成：site/ ==="
