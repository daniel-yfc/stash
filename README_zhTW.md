# stash

個人工具、腳本與程式庫的收藏。

## 給維護者 / 刮削器作者

本倉庫包含一套 **Stash 刮削器建構技能（skill）** 與參考文件，協助產生與維護基於 XPath 的 YAML 刮削器。

- 技能與工作流程：
  - [`skills/stash-scraper-builder/SKILL.md`](skills/stash-scraper-builder/SKILL.md)
- 參考文件：
  - [`skills/stash-scraper-builder/references/`](skills/stash-scraper-builder/references/)
    - `schema-checklist.md` – 資料模型、欄位、驗證規則
    - `xpath-patterns.md` – 選擇器模式與除錯
    - `date-formats.md` – 日期正規化與 `parseDate`
    - `post-processing.md` – 運算子與管線順序
    - `scraping-failures.md` – 執行階段失敗與診斷
    - `eval-pack.md` – Stash 測試流程與品質門檻
    - `best-practices.md` – 可維護刮削器模式
    - `multi-site-network-scrapers.md` – 多站台網路刮削器模式
- 權威執行階段參考：
  - https://deepwiki.com/stashapp/CommunityScrapers/

在新增或更新刮削器時，請遵循技能工作流程與參考文件，並以 DeepWiki 頁面作為 Stash/CommunityScrapers 執行階段模型的權威指南。
