#!/usr/bin/env node
// Real-case scrutiny: for each scraper, derive a real scene URL via its search
// endpoint, fetch the page, then exercise the sceneScraper XPaths to see what
// actually populates. Reports per-scraper field coverage.
//
// Run: node tools/scrutiny.js [scraper-name.yml ...]
//      node tools/scrutiny.js --all
//      node tools/scrutiny.js --probe=word1,word2 scraper.yml   # custom probes
//      node tools/scrutiny.js --paginate scraper.yml            # walk pages
//      node tools/scrutiny.js --search scraper.yml              # test searchScraper
//      node tools/scrutiny.js --url=<url> scraper.yml           # test specific scene URL
//      node tools/scrutiny.js --help
//
// Network: yes, hits the live upstream sites. Be polite.

import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";
import { JSDOM, VirtualConsole } from "jsdom";

// Suppress noisy CSS parse warnings from JSDOM (cosmetic, not real errors)
const quietConsole = new VirtualConsole();
quietConsole.on("jsdomError", () => {});
const _origConsoleError = console.error;
console.error = (...args) => {
  const s = args.join(" ");
  if (/Could not parse CSS stylesheet/.test(s)) return;
  _origConsoleError.apply(console, args);
};

const ROOT = process.cwd();
const SCRAPERS = path.join(ROOT, "scrapers");
const POLITE_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// XPath result types
const XP_ALL = 7; // ORDERED_NODE_SNAPSHOT_TYPE

function showHelp() {
  console.log(`
Usage: node tools/scrutiny.js [options] [scraper.yml ...]

Options:
  --all                 Run scrutiny across all scrapers in scrapers/
  --probe=<csv>         Custom search probe terms (e.g. --probe=sample,2026)
  --paginate            Walk pages 1-3 when searching candidates
  --multi               Test multiple candidate scene URLs (up to 5 per probe)
  --search              Also evaluate searchScraper on search results page
  --url=<url>           Evaluate sceneScraper directly against a specific URL
  --cookie=<str>        Provide cookie header string (e.g. --cookie="PHPSESSID=...")
  --help                Show this help message

Examples:
  node tools/scrutiny.js scrapers/ACCEED.yml --search
  node tools/scrutiny.js scrapers/CK-Download.yml --paginate --multi
  node tools/scrutiny.js scrapers/Mens-RushTV.yml --url='https://www.mensrush.tv/single.php?id=...'
`);
}

// --- CLI args ---
function parseArgs(argv) {
  const opts = {
    files: [],
    probe: null,
    paginate: false,
    multiUrl: false,
    searchReport: false,
    url: null,
    cookie: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      opts.help = true;
      continue;
    }
    if (a === "--all") {
      opts.all = true;
      continue;
    }
    if (a === "--paginate") {
      opts.paginate = true;
      continue;
    }
    if (a === "--multi") {
      opts.multiUrl = true;
      continue;
    }
    if (a === "--search") {
      opts.searchReport = true;
      continue;
    }
    if (a.startsWith("--probe=")) {
      opts.probe = a.slice(8).split(",");
      continue;
    }
    if (a.startsWith("--url=")) {
      opts.url = a.slice(6);
      continue;
    }
    if (a.startsWith("--cookie=")) {
      opts.cookie = a.slice(9);
      continue;
    }
    if (a.startsWith("-")) continue;
    opts.files.push(a);
  }
  return opts;
}

// --- File listing ---
function listScrapers() {
  const out = [];
  for (const dir of [SCRAPERS, path.join(SCRAPERS, "private")]) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".yml"))) {
      out.push(path.join(dir, f));
    }
  }
  return out.sort();
}

// --- HTTP fetch with retries ---
async function fetchHTML(url, cookie, attempt = 1) {
  const headers = {
    "User-Agent": POLITE_UA,
    "Accept-Language": "ja,en;q=0.5",
  };
  if (cookie) {
    headers["Cookie"] = cookie;
  }
  try {
    const res = await fetch(url, { headers, redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get("content-type") || "";
    if (!/text\/html|xml/.test(ct)) throw new Error(`non-HTML content-type: ${ct}`);
    return await res.text();
  } catch (e) {
    if (attempt < 2 && /ECONNRESET|fetch failed|socket hang up/i.test(e.message)) {
      await new Promise((r) => setTimeout(r, 500));
      return fetchHTML(url, cookie, attempt + 1);
    }
    throw e;
  }
}

// --- Build a probe URL from a scraper's search config ---
function buildProbeURL(template, probe, page) {
  let url = template
    .replaceAll("{}", encodeURIComponent(probe))
    .replaceAll("{query}", encodeURIComponent(probe))
    .replaceAll("{q}", encodeURIComponent(probe))
    .replaceAll("{title}", encodeURIComponent(probe));

  if (page != null) {
    if (url.includes("{page}")) {
      url = url.replaceAll("{page}", page);
    } else if (url.includes("{p}")) {
      url = url.replaceAll("{p}", page);
    } else if (/[?&]page=/.test(url)) {
      url = url.replace(/([?&]page=)\d+/, `$1${page}`);
    } else if (/[?&]p=/.test(url)) {
      url = url.replace(/([?&]p=)\d+/, `$1${page}`);
    } else {
      url += (url.includes("?") ? "&" : "?") + "page=" + page;
    }
  }
  return url;
}

// --- Default probes by domain/family ---
function defaultProbes(scraperDoc) {
  const queryURL = (scraperDoc.sceneByName || scraperDoc.sceneByFragment || {}).queryURL || "";
  const probes = ["a", "DVD", "2026", "sample"];
  if (/acceed/i.test(queryURL)) probes.unshift("ACST", "ノンケ");
  if (/ck-download/i.test(queryURL)) probes.unshift("CK", "男");
  if (/games-video/i.test(queryURL)) probes.unshift("GV-OAV", "GVO");
  if (/mensrush/i.test(queryURL)) probes.unshift("MR-");
  if (/ko-video|ko-shop|ko-tube/i.test(queryURL)) probes.unshift("KBEA", "KBO");
  if (/justice/i.test(queryURL)) probes.unshift("JUSTICE");
  if (/hunks/i.test(queryURL)) probes.unshift("HUNKS");
  return probes;
}

// --- Extract candidate scene URLs from search HTML via searchScraper ---
function extractSceneURLs(searchHTML, scraperDoc, baseURL, probe, page) {
  const dom = new JSDOM(searchHTML, { virtualConsole: quietConsole });
  const xdoc = dom.window.document;
  const searchScraper = (scraperDoc.xPathScrapers || {})[
    (scraperDoc.sceneByName || scraperDoc.sceneByFragment || {}).scraper
  ];
  if (!searchScraper) return [];

  const urlsSel = searchScraper.scene && searchScraper.scene.URLs;
  if (!urlsSel) return [];

  let candidates = [];
  try {
    let sel = typeof urlsSel === "string" ? urlsSel : urlsSel.selector;
    if (!sel) return [];
    const common = searchScraper.common || {};
    for (const [k, v] of Object.entries(common)) {
      const key = k.startsWith("$") ? k : "$" + k;
      sel = sel.replaceAll(key, v);
    }
    const snap = xdoc.evaluate(sel, xdoc, null, XP_ALL, null);
    for (let i = 0; i < snap.snapshotLength; i++) {
      const node = snap.snapshotItem(i);
      let href = node.nodeValue || node.textContent || "";
      if (!href) continue;
      if (typeof urlsSel === "object" && urlsSel.postProcess) {
        for (const pp of urlsSel.postProcess) {
          if (pp.replace) {
            for (const r of pp.replace) {
              href = href.replace(new RegExp(r.regex), r.with);
            }
          }
        }
      }
      try {
        const full = new URL(href, baseURL).toString();
        candidates.push(full);
      } catch {
        // ignore invalid URL
      }
    }
  } catch {
    // evaluate failed
  }

  // Fallback heuristic: find all <a> matching sceneByURL patterns
  if (candidates.length === 0) {
    const patterns = (scraperDoc.sceneByURL || []).map((s) => s.url);
    const snap = xdoc.evaluate("//a[@href]/@href", xdoc, null, XP_ALL, null);
    for (let i = 0; i < snap.snapshotLength; i++) {
      const href = snap.snapshotItem(i).nodeValue;
      if (!href) continue;
      try {
        const full = new URL(href, baseURL).toString();
        for (const pat of patterns) {
          const patNorm = pat.replace(/^https?:\/\//, "").replace(/^www\./, "");
          const hostAndPath = full.replace(/^https?:\/\//, "").replace(/^www\./, "");
          if (hostAndPath.startsWith(patNorm.split("?")[0]) || hostAndPath.includes(patNorm)) {
            candidates.push(full);
            break;
          }
        }
      } catch {
        // ignore invalid URL
      }
    }
  }

  const deduped = [];
  const seen = new Set();
  for (const c of candidates) {
    if (!seen.has(c)) {
      seen.add(c);
      deduped.push({ url: c, probe, page });
    }
  }
  return deduped;
}

// --- Find test scene URLs for a scraper ---
async function findSceneURLs(scraperDoc, opts) {
  const sb = scraperDoc.sceneByName || scraperDoc.sceneByFragment;
  if (!sb || !sb.queryURL) {
    return { urls: [], reason: "no sceneByName/sceneByFragment.queryURL" };
  }

  const probes = opts.probe || defaultProbes(scraperDoc);
  const pages = opts.paginate ? [1, 2, 3] : [null];

  const PER_PROBE_CAP = 5;
  const seen = new Set();
  const candidates = [];
  let lastReason = "";

  for (const probe of probes) {
    for (const page of pages) {
      let perProbeAdded = 0;
      const probeURL = buildProbeURL(sb.queryURL, probe, page);
      let html;
      try {
        html = await fetchHTML(probeURL, opts.cookie);
      } catch (e) {
        lastReason = `search fetch failed: ${e.message}`;
        continue;
      }
      // A true login gate removes search results; look for a login form/redirect
      // while also confirming no usable results are present. Some sites keep a
      // persistent "guest / login" header even on public search pages.
      const hasLoginGate =
        /(?:window\.location|location\.href)\s*=\s*["'][^"']*login\.(?:php|html)/i.test(html) ||
        /<form[^>]+action=["'][^"']*login\.(?:php|html)["']/i.test(html) ||
        /<input[^>]+(?:type=["']password["']|name=["']pass(?:word)?["'])/i.test(html);
      const hasResults =
        html.includes("movie_detail.php") ||
        html.includes("movie_box") ||
        html.includes("item_img") ||
        html.includes("detail.php?product_id") ||
        html.includes("list_title");
      if (hasLoginGate && !hasResults) {
        lastReason = "search redirected to login";
        continue;
      }
      const cands = extractSceneURLs(html, scraperDoc, probeURL, probe, page);
      for (const c of cands) {
        if (!seen.has(c.url) && perProbeAdded < PER_PROBE_CAP) {
          seen.add(c.url);
          candidates.push(c);
          perProbeAdded++;
        }
      }
      if (!opts.paginate && !opts.multiUrl && candidates.length > 0) {
        return {
          urls: candidates,
          probeCount: 1,
          pageCount: 1,
          searchURL: sb.queryURL,
        };
      }
      if (pages.length > 1) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }
    if (!opts.multiUrl && candidates.length > 0) {
      break;
    }
  }

  return {
    urls: candidates,
    probeCount: probes.length,
    pageCount: pages.length,
    searchURL: sb.queryURL,
    reason: candidates.length === 0 ? lastReason || "no candidates from any probe" : null,
  };
}

// --- Evaluate an XPath against JSDOM document ---
function runXPath(selector, ctx) {
  const { doc, common } = ctx;
  let sel = selector;
  if (common) {
    for (const [k, v] of Object.entries(common)) {
      const key = k.startsWith("$") ? k : "$" + k;
      sel = sel.replaceAll(key, v);
    }
  }

  try {
    const snap = doc.evaluate(sel, doc, null, XP_ALL, null);
    const count = snap.snapshotLength;
    const samples = [];
    for (let i = 0; i < Math.min(count, 3); i++) {
      const node = snap.snapshotItem(i);
      const text = node.nodeValue || node.textContent || "";
      samples.push(text.trim());
    }
    return { count, samples, selector: sel, error: null };
  } catch (e) {
    return { count: 0, samples: [], selector: sel, error: e.message };
  }
}

function tryFieldWithDoc(val, ctx) {
  if (typeof val === "string") return runXPath(val, ctx);
  if (val && typeof val === "object") {
    const out = {};
    if (val.selector) out.selector = runXPath(val.selector, ctx);
    if (val.fixed !== undefined) out.fixed = val.fixed;
    if (val.postProcess) out.postProcess = val.postProcess;
    if (val.Name) out.Name = tryFieldWithDoc(val.Name, ctx);
    return out;
  }
  return null;
}

function collectSelectors(val, acc = []) {
  if (!val) return acc;
  if (val.selector) acc.push(val.selector);
  if (val.Name) collectSelectors(val.Name, acc);
  return acc;
}

function summarize(v) {
  if (v == null) return "∅";
  if (typeof v === "string") return v;
  if (v.selector) {
    const s = v.selector;
    if (s.error) return `ERROR: ${s.message || JSON.stringify(s)}`;
    if (s.count === 0) return "∅ (0 nodes)";
    return `${s.count} nodes | ${(s.samples || []).map((x) => '"' + x.replace(/\s+/g, " ").slice(0, 60) + '"').join(" / ")}`;
  }
  if (v.Name) {
    return summarize(v.Name);
  }
  if (v.fixed) return `<fixed:${v.fixed}>`;
  return JSON.stringify(v).slice(0, 200);
}

function countPopulated(fields) {
  let n = 0;
  for (const attrs of Object.values(fields)) {
    for (const v of Object.values(attrs)) {
      for (const sel of collectSelectors(v)) {
        if (sel && sel.count > 0) n++;
      }
    }
  }
  return n;
}

function countTotal(fields) {
  let n = 0;
  for (const attrs of Object.values(fields)) {
    for (const v of Object.values(attrs)) {
      n += collectSelectors(v).length;
    }
  }
  return n;
}

// --- Test one scraper against scene URLs ---
async function testScraper(file, opts) {
  const rel = path.relative(ROOT, file);
  const doc = yaml.parse(fs.readFileSync(file, "utf8"));
  const entry = { file: rel, name: doc.name };

  let tested = [];
  let found = { urls: [] };

  if (opts.url) {
    tested = [{ url: opts.url, probe: "direct", page: null }];
    entry.urlCandidates = 1;
  } else {
    found = await findSceneURLs(doc, opts);
    if (found.urls.length === 0) {
      entry.status = "SKIP";
      entry.reason = found.reason;
      return entry;
    }
    const limit = opts.multiUrl ? found.urls.length : 1;
    tested = found.urls.slice(0, limit);
    entry.probeCount = found.probeCount;
    entry.pageCount = found.pageCount;
    entry.searchURL = found.searchURL;
    entry.urlCandidates = found.urls.length;
  }

  const perUrl = [];
  for (const cand of tested) {
    const urlEntry = { url: cand.url, probe: cand.probe, page: cand.page };
    let html;
    try {
      html = await fetchHTML(cand.url, opts.cookie);
    } catch (e) {
      urlEntry.status = "FETCH_FAIL";
      urlEntry.reason = e.message;
      perUrl.push(urlEntry);
      continue;
    }
    const dom = new JSDOM(html, { virtualConsole: quietConsole });
    const xdoc = dom.window.document;
    const sceneScraper = (doc.xPathScrapers || {})[doc.sceneByURL?.[0]?.scraper];
    if (!sceneScraper) {
      urlEntry.status = "NO_SCENE_SCRAPER";
      perUrl.push(urlEntry);
      continue;
    }
    const ctx = { doc: xdoc, common: sceneScraper.common || {} };
    const result = {};
    if (sceneScraper.scene) {
      result.scene = {};
      for (const [k, v] of Object.entries(sceneScraper.scene)) {
        result.scene[k] = tryFieldWithDoc(v, ctx);
      }
    }
    urlEntry.fields = result;
    urlEntry.status = "OK";
    perUrl.push(urlEntry);
    await new Promise((r) => setTimeout(r, 300));
  }

  // Also exercise the searchScraper on the search results page, if present
  if (opts.searchReport && (found.searchURL || doc.sceneByName || doc.sceneByFragment)) {
    const sb = doc.sceneByName || doc.sceneByFragment;
    const searchKey = sb && sb.scraper;
    const searchDef = searchKey && doc.xPathScrapers && doc.xPathScrapers[searchKey];
    const bestCand = tested[0] || found.urls[0];
    const probe =
      bestCand && bestCand.probe !== "direct" ? bestCand.probe : opts.probe ? opts.probe[0] : "a";
    const page = opts.paginate ? 2 : bestCand ? bestCand.page : null;
    const searchPageURL = buildProbeURL(sb.queryURL, probe, page);
    if (searchDef) {
      try {
        const html = await fetchHTML(searchPageURL, opts.cookie);
        const dom = new JSDOM(html, { virtualConsole: quietConsole });
        const ctx = { doc: dom.window.document, common: searchDef.common || {} };
        const result = {};
        if (searchDef.scene) {
          result.scene = {};
          for (const [k, v] of Object.entries(searchDef.scene)) {
            result.scene[k] = tryFieldWithDoc(v, ctx);
          }
        }
        entry.searchFields = result;
        entry.searchPageURL = searchPageURL;
        entry.searchProbe = probe;
      } catch (e) {
        entry.searchError = e.message;
      }
    }
  }

  entry.urls = perUrl;
  entry.status = perUrl.some((u) => u.status === "OK") ? "OK" : perUrl[0].status;
  const firstOk = perUrl.find((u) => u.status === "OK");
  if (firstOk) {
    entry.sceneURL = firstOk.url;
    entry.fields = firstOk.fields;
  }
  return entry;
}

function printEntry(e) {
  console.log(`\n=== ${e.file} ===`);
  if (e.probeCount)
    console.log(
      `  probes : ${e.probeCount} (${e.pageCount} page each), ${e.urlCandidates} candidates`,
    );
  if (e.urls && e.urls.length > 1) console.log(`  tested : ${e.urls.length} URLs`);
  if (e.sceneURL) console.log(`  scene  : ${e.sceneURL}`);
  if (e.fields) {
    console.log("  [scene-scraper on detail page]");
    printFields(e.fields);
  }
  if (e.searchFields) {
    console.log("  [search-scraper on search page]");
    printFields(e.searchFields);
  } else if (e.reason) {
    console.log(`  result : ${e.reason}`);
  }
  if (e.searchError) console.log(`  search-error: ${e.searchError}`);
  if (e.urls && e.urls.length > 1) {
    for (const u of e.urls) {
      if (u.status !== "OK") continue;
      const pop = countPopulated(u.fields);
      const tot = countTotal(u.fields);
      console.log(
        `    [${pop}/${tot}] ${u.url}  (probe=${u.probe}${u.page != null ? ` p=${u.page}` : ""})`,
      );
    }
  }
}

function printFields(fields) {
  for (const [field, attrs] of Object.entries(fields)) {
    for (const [k, v] of Object.entries(attrs)) {
      console.log(`    ${field}.${k.padEnd(12)} : ${summarize(v)}`);
    }
  }
}

// --- Main ---
async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    showHelp();
    return;
  }

  let files;
  if (opts.all) {
    files = listScrapers();
  } else if (opts.files.length > 0) {
    files = opts.files.map((a) => (path.isAbsolute(a) ? a : path.join(ROOT, a)));
  } else {
    showHelp();
    return;
  }

  const summary = [];
  for (const f of files) {
    const entry = await testScraper(f, opts);
    summary.push(entry);
    printEntry(entry);
  }

  console.log("\n\n========== SUMMARY ==========");
  for (const e of summary) {
    const populated = e.fields ? countPopulated(e.fields) : 0;
    const total = e.fields ? countTotal(e.fields) : 0;
    const searchPop = e.searchFields ? countPopulated(e.searchFields) : 0;
    const searchTot = e.searchFields ? countTotal(e.searchFields) : 0;
    const extra =
      e.urls && e.urls.length > 1
        ? ` [multi: ${e.urls
            .filter((u) => u.status === "OK")
            .map((u) => countPopulated(u.fields) + "/" + countTotal(u.fields))
            .join(", ")}]`
        : "";
    const searchExtra = e.searchFields ? ` search=${searchPop}/${searchTot}` : "";
    console.log(
      `${e.status.padEnd(12)} ${e.file.padEnd(40)} scene=${populated}/${total}${searchExtra}  candidates=${e.urlCandidates || "-"}  ${e.sceneURL ? e.sceneURL.slice(0, 60) : e.reason || ""}${extra}`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
