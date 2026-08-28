#!/usr/bin/env -S deno run --allow-read --allow-write
// Scraper Schema Validator — Chinese Traditional (zh-TW)
// Usage: deno run --allow-read --allow-write index-zh-TW.mjs <scraper.yml>

import { parse } from "https://deno.land/std@0.224.0/yaml/parse.ts";
import Ajv from "https://esm.sh/ajv@8.12.0";

// 使用 Deno.args 而非 process.argv
const args = Deno.args;

if (args.length === 0) {
  console.error("Usage: deno run index-zh-TW.mjs <scraper.yml>");
  Deno.exit(1);
}

const filePath = args[0];

// 讀取 YAML 文件
let yamlContent;
try {
  const text = await Deno.readTextFile(filePath);
  yamlContent = parse(text);
} catch (error) {
  console.error(`❌ 無法讀取文件：${filePath}`);
  console.error(`   錯誤：${error.message}`);
  Deno.exit(1);
}

// 讀取 Schema
let schema;
try {
  const schemaText = await Deno.readTextFile("validator/scraper.schema.json");
  schema = JSON.parse(schemaText);
} catch (error) {
  console.error(`❌ 無法讀取 Schema`);
  console.error(`   錯誤：${error.message}`);
  Deno.exit(1);
}

// 驗證
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
const valid = validate(yamlContent);

if (!valid) {
  console.error(`❌ Schema 驗證失敗：${filePath}`);
  validate.errors.forEach((err) => {
    const path = err.instancePath || "/";
    console.error(`   - ${path}: ${err.message}`);
  });
  Deno.exit(1);
}

console.log(`✅ Schema 驗證通過：${filePath}`);
