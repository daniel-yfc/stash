import fs from 'node:fs';
import path from 'node:path';

import Ajv from "npm:ajv@8"

import betterAjvErrors from 'npm:better-ajv-errors@2';
import chalk from 'npm:chalk@5';
import { parse } from 'npm:yaml@2';
import addFormats from "npm:ajv-formats@3"

// [https://www.peterbe.com/plog/nodejs-fs-walk-or-glob-or-fast-glob](https://www.peterbe.com/plog/nodejs-fs-walk-or-glob-or-fast-glob)
function walk(directory, ext, filepaths = []) {
  const files = fs.readdirSync(directory);
  for (const filename of files) {
    const filepath = path.join(directory, filename);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, ext, filepaths);
    } else if (path.extname(filename) === ext) {
      filepaths.push(filepath);
    }
  }
  return filepaths;
}

// [https://stackoverflow.com/a/53833620](https://stackoverflow.com/a/53833620)
const isSorted = arr => arr.every((v,i,a) => !i || a[i-1] <= v);

class Validator {
  constructor(flags) {
    this.allowDeprecations = flags.includes('-d');
    this.stopOnError = !flags.includes('-a');
    this.sortedURLs = flags.includes('-s');
    this.verbose = flags.includes('-v');

    const schemaPath = path.resolve(import.meta.dirname, './scraper.schema.json');
    this.schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    this.ajv = new Ajv({
      // allErrors: true,
      strict: true,
    });
    addFormats(this.ajv);

    this.mappingPattern = /^([a-z]+)By(Fragment|Name|URL)$/;
  }

  run(files) {
    let scrapers;

    if (files && Array.isArray(files) && files.length > 0) {
      scrapers = files.map(file => path.resolve(file));
    } else {
      const scrapersDir = path.resolve(import.meta.dirname, '../scrapers');
      scrapers = walk(scrapersDir, '.yml');
    }

    const yamlLoadOptions = {
      prettyErrors: true,
      version: '1.2',
      merge: true,
    };

    let result = true;
    const validate = this.ajv.compile(this.schema);

    for (const file of scrapers) {
      const relPath = path.relative(process.cwd(), file);
      let contents, data;
      try {
        contents = fs.readFileSync(file, 'utf8');
        data = parse(contents, yamlLoadOptions);
      } catch (error) {
        console.error(`${chalk.red(chalk.bold('錯誤'))}：${relPath}`);
        error.stack = null;
        console.error(error);
        result = result && false;
        if (this.stopOnError) break;
        else continue;
      }

      let valid = validate(data);

      // If schema validation did not pass, don't try to validate mappings.
      if (valid) {
        const mappingErrors = this.getMappingErrors(data);
        const validMapping = mappingErrors.length === 0;
        if (!validMapping) {
          validate.errors = (validate.errors || []).concat(mappingErrors);
        }

        valid = valid && validMapping;
      }

      // Output validation errors
      if (!valid) {
        const output = betterAjvErrors('scraper', data, validate.errors, { indent: 2 });
        console.log(output);
      }

      if (this.verbose || !valid) {
        const validColor = valid ? chalk.green : chalk.red;
        console.log(`${relPath} 驗證：${validColor(valid ? '通過' : '失敗')}`);
      }

      result = result && valid;

      if (!valid && this.stopOnError) break;
    }

    if (!this.verbose && result) {
      console.log(chalk.green('驗證通過！'));
    }

    return result;
  }

  getMappingErrors(data) {
    return [].concat(
      this._collectConfigMappingErrors(data),
      this._collectScraperDefinitionErrors(data),
      this._collectCookieErrors(data),
    );
  }

  _collectConfigMappingErrors(data) {
    const errors = [];

    if (data.sceneByName && !data.sceneByQueryFragment) {
      errors.push({
        keyword: 'sceneByName',
        message: `使用 \`sceneByName\` 時必須同時設定 \`sceneByQueryFragment\``,
        params: { keyword: 'sceneByName' },
        dataPath: '/sceneByName',
      });
    }

    return errors;
  }

  _collectScraperDefinitionErrors(data) {
    const hasStashServer = Object.keys(data).includes('stashServer');
    const xPathScrapers = data.xPathScrapers ? Object.keys(data.xPathScrapers) : [];
    const jsonScrapers = data.jsonScrapers ? Object.keys(data.jsonScrapers) : [];

    let needsStashServer = false;
    const configuredXPathScrapers = [];
    const configuredJsonScrapers = [];

    const errors = [];

    Object.entries(data).forEach(([key, value]) => {
      const match = this.mappingPattern.exec(key);
      if (!match) {
        return;
      }

      const seenURLs = {};

      const type = match[1];

      const multiple = value instanceof Array;
      (multiple ? value : [value]).forEach(({ action, scraper, url }, idx) => {
        const dataPath = `/${key}${multiple ? `/${idx}` : ''}`;

        if (action === 'stash') {
          needsStashServer = true;
          if (!hasStashServer) {
            errors.push({
              keyword: 'action',
              message: `必須在根物件中定義 \`stashServer\``,
              params: { keyword: 'action' },
              dataPath: dataPath + '/action',
            });
          }
          return;
        }

        if (action === 'scrapeXPath') {
          configuredXPathScrapers.push(scraper);
          if (!xPathScrapers.includes(scraper)) {
            errors.push({
              keyword: 'scraper',
              message: `xPathScrapers 中缺少 XPath 刮削器定義：\`${scraper}\``,
              params: { keyword: 'scraper' },
              dataPath: dataPath + '/scraper',
            });
          } else if (!data.xPathScrapers || !data.xPathScrapers[scraper][type]) {
            errors.push({
              keyword: scraper,
              message: `\`${scraper}\` 定義的實體型別必須是 \`${type}\``,
              params: { keyword: scraper },
              dataPath: `/xPathScrapers/${scraper}`,
            });
          }

          if (url) {
            url.forEach((u, uIdx) => {
              const exists = seenURLs[u];
              if (exists) {
                errors.push({
                  keyword: 'url',
                  message: `型別 \`${type}\` 的 URL 不可重複，已存在於 ${exists}`,
                  params: { keyword: 'url' },
                  dataPath: `${dataPath}/url/${uIdx}`,
                });
              } else {
                seenURLs[u] = `${dataPath}/url/${uIdx}`;
              }
            });

            if (this.sortedURLs && !isSorted(url)) {
              errors.push({
                keyword: 'url',
                message: 'URL 清單必須按字母升序排序',
                params: { keyword: 'url' },
                dataPath: dataPath + '/url',
              });
            }
          }

          return;
        }

        if (action === 'scrapeJson') {
          configuredJsonScrapers.push(scraper);
          if (!jsonScrapers.includes(scraper)) {
            errors.push({
              keyword: 'scraper',
              message: `jsonScrapers 中缺少 JSON 刮削器定義：\`${scraper}\``,
              params: { keyword: 'scraper' },
              dataPath: dataPath + '/scraper',
            });
          } else if (!data.jsonScrapers || !data.jsonScrapers[scraper][type]) {
            errors.push({
              keyword: scraper,
              message: `\`${scraper}\` 定義的實體型別必須是 \`${type}\``,
              params: { keyword: scraper },
              dataPath: `/jsonScrapers/${scraper}`,
            });
          }

          if (url) {
            url.forEach((u, uIdx) => {
              const exists = seenURLs[u];
              if (exists) {
                errors.push({
                  keyword: 'url',
                  message: `型別 \`${type}\` 的 URL 不可重複，已存在於 ${exists}`,
                  params: { keyword: 'url' },
                  dataPath: `${dataPath}/url/${uIdx}`,
                });
              } else {
                seenURLs[u] = `${dataPath}/url/${uIdx}`;
              }
            });

            if (this.sortedURLs && !isSorted(url)) {
              errors.push({
                keyword: 'url',
                message: 'URL 清單必須按字母升序排序',
                params: { keyword: 'url' },
                dataPath: dataPath + '/url',
              });
            }
          }

          return;
        }

        // if (action === 'script') {
        //   return;
        // }
        //
        // errors.push({
        //   keyword: 'action',
        //   message: `不支持的 action：\`${action}\``,
        //   params: { keyword: 'action' },
        //   dataPath: dataPath + '/action',
        // });
      });
    });

    // Check for unused definitions

    if (!needsStashServer && hasStashServer) {
      errors.unshift({
        keyword: 'stashServer',
        message: '已定義 `stashServer` 但從未使用',
        params: { keyword: 'stashServer' },
        dataPath: '/stashServer',
      });
    }

    return errors;
  }

  _collectCookieErrors(data) {
    const errors = [];

    const cookies = data.driver && data.driver.cookies;
    if (cookies) {
      const usesCDP = Boolean(data.driver && data.driver.useCDP);
      cookies.forEach((cookieItem, idx) => {
        const hasCookieURL = 'CookieURL' in cookieItem;
        if (!usesCDP && !hasCookieURL) {
          errors.push({
            keyword: 'CookieURL',
            message: '`useCDP` 為 `false` 時必須設定 `CookieURL`',
            params: { keyword: 'CookieURL' },
            dataPath: `/driver/cookies/${idx}`,
          });
        } else if (usesCDP && hasCookieURL) {
          errors.push({
            keyword: 'CookieURL',
            message: '`useCDP` 為 `true` 時不得設定 `CookieURL`',
            params: { keyword: 'CookieURL' },
            dataPath: `/driver/cookies/${idx}/CookieURL`,
          });
        }
      });
    }

    return errors;
  }
}

export function main(flags, files) {
  const args = process.argv.slice(2)
  flags = (flags === undefined) ? args.filter(arg => arg.startsWith('-')) : flags;
  files = (files === undefined) ? args.filter(arg => !arg.startsWith('-')) : files;
  const validator = new Validator(flags);
  const result = validator.run(files);
  if (flags.includes('--ci')) {
    process.exit(result ? 0 : 1);
  }
}
export default main

main()
