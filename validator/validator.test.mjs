import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

import { Validator, isSorted, walk } from './index.mjs';

describe('Validator Helpers', () => {
  it('isSorted correctly identifies sorted and unsorted arrays', () => {
    assert.equal(isSorted([]), true);
    assert.equal(isSorted(['a']), true);
    assert.equal(isSorted(['a', 'b', 'c']), true);
    assert.equal(isSorted(['https://example.com/a', 'https://example.com/b']), true);
    assert.equal(isSorted(['b', 'a']), false);
    assert.equal(isSorted(['https://example.com/b', 'https://example.com/a']), false);
  });

  it('walk finds files with matching extensions recursively', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'validator-test-walk-'));
    try {
      const subDir = path.join(tmpDir, 'sub');
      fs.mkdirSync(subDir);
      fs.writeFileSync(path.join(tmpDir, 'file1.yml'), 'name: Test1');
      fs.writeFileSync(path.join(subDir, 'file2.yml'), 'name: Test2');
      fs.writeFileSync(path.join(tmpDir, 'file3.txt'), 'ignore me');

      const files = walk(tmpDir, '.yml');
      assert.equal(files.length, 2);
      assert.ok(files.some(f => f.endsWith('file1.yml')));
      assert.ok(files.some(f => f.endsWith('file2.yml')));
      assert.ok(!files.some(f => f.endsWith('file3.txt')));
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});

describe('Validator Constructor & Flags', () => {
  it('parses flags correctly', () => {
    const v1 = new Validator(['-d', '-a', '-s', '-v']);
    assert.equal(v1.allowDeprecations, true);
    assert.equal(v1.stopOnError, false);
    assert.equal(v1.sortedURLs, true);
    assert.equal(v1.verbose, true);

    const v2 = new Validator([]);
    assert.equal(v2.allowDeprecations, false);
    assert.equal(v2.stopOnError, true);
    assert.equal(v2.sortedURLs, false);
    assert.equal(v2.verbose, false);
  });

  it('loads schema successfully', () => {
    const validator = new Validator([]);
    assert.ok(validator.schema);
    assert.equal(validator.schema.$schema, 'http://json-schema.org/draft-07/schema#');
    assert.ok(validator.ajv);
  });
});

describe('Validator Method: _collectConfigMappingErrors', () => {
  const validator = new Validator([]);

  it('returns an error if sceneByName is defined without sceneByQueryFragment', () => {
    const data = {
      name: 'TestScraper',
      sceneByName: { action: 'scrapeXPath', scraper: 'testScraper' }
    };
    const errors = validator._collectConfigMappingErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'sceneByName');
    assert.match(errors[0].message, /sceneByQueryFragment/);
  });

  it('returns no errors if sceneByName is paired with sceneByQueryFragment', () => {
    const data = {
      name: 'TestScraper',
      sceneByName: { action: 'scrapeXPath', scraper: 'testScraper' },
      sceneByQueryFragment: { action: 'scrapeXPath', scraper: 'testScraper' }
    };
    assert.deepEqual(validator._collectConfigMappingErrors(data), []);
  });
});

describe('Validator Method: _collectScraperDefinitionErrors', () => {
  const validator = new Validator([]);
  const sortedValidator = new Validator(['-s']);

  it('detects stash action without stashServer definition', () => {
    const data = {
      name: 'TestScraper',
      sceneByURL: { action: 'stash' }
    };
    const errors = validator._collectScraperDefinitionErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'action');
    assert.match(errors[0].message, /stashServer/);
  });

  it('detects unused stashServer definition', () => {
    const data = {
      name: 'TestScraper',
      stashServer: { url: 'https://stash.example.com' },
      sceneByURL: { action: 'scrapeXPath', scraper: 'xPathScraper' },
      xPathScrapers: { xPathScraper: { scene: {} } }
    };
    const errors = validator._collectScraperDefinitionErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'stashServer');
    assert.match(errors[0].message, /never used/);
  });

  it('detects missing XPath scraper definition', () => {
    const data = {
      name: 'TestScraper',
      sceneByURL: { action: 'scrapeXPath', scraper: 'missingScraper' }
    };
    const errors = validator._collectScraperDefinitionErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'scraper');
    assert.match(errors[0].message, /xPathScrapers should contain/);
  });

  it('detects XPath scraper definition that does not create correct type object', () => {
    const data = {
      name: 'TestScraper',
      sceneByURL: { action: 'scrapeXPath', scraper: 'xPathScraper' },
      xPathScrapers: { xPathScraper: { performer: {} } }
    };
    const errors = validator._collectScraperDefinitionErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'xPathScraper');
    assert.match(errors[0].message, /should create an object of type `scene`/);
  });

  it('detects duplicate URLs across mapping entries for the same entity type', () => {
    const data = {
      name: 'TestScraper',
      sceneByURL: [
        { action: 'scrapeXPath', scraper: 'xPathScraper', url: ['https://a.com', 'https://b.com'] },
        { action: 'scrapeXPath', scraper: 'xPathScraper', url: ['https://b.com', 'https://c.com'] }
      ],
      xPathScrapers: { xPathScraper: { scene: {} } }
    };
    const errors = validator._collectScraperDefinitionErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'url');
    assert.match(errors[0].message, /already exists/);
  });

  it('detects unsorted URLs when sortedURLs option is enabled', () => {
    const data = {
      name: 'TestScraper',
      sceneByURL: {
        action: 'scrapeXPath',
        scraper: 'xPathScraper',
        url: ['https://example.com/z', 'https://example.com/a']
      },
      xPathScrapers: { xPathScraper: { scene: {} } }
    };
    const errors = sortedValidator._collectScraperDefinitionErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'url');
    assert.match(errors[0].message, /sorted in ascending/);
  });

  it('detects missing JSON scraper definition and mismatched entity type', () => {
    const data = {
      name: 'TestScraper',
      performerByURL: { action: 'scrapeJson', scraper: 'missingJson' }
    };
    const errors = validator._collectScraperDefinitionErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'scraper');
    assert.match(errors[0].message, /jsonScrapers should contain/);

    const dataMismatch = {
      name: 'TestScraper',
      performerByURL: { action: 'scrapeJson', scraper: 'jsonScraper' },
      jsonScrapers: { jsonScraper: { scene: {} } }
    };
    const errorsMismatch = validator._collectScraperDefinitionErrors(dataMismatch);
    assert.equal(errorsMismatch.length, 1);
    assert.equal(errorsMismatch[0].keyword, 'jsonScraper');
    assert.match(errorsMismatch[0].message, /should create an object of type `performer`/);
  });
});

describe('Validator Method: _collectCookieErrors', () => {
  const validator = new Validator([]);

  it('returns error if CookieURL is missing when useCDP is false or omitted', () => {
    const data = {
      name: 'TestScraper',
      driver: {
        cookies: [{ name: 'session', value: '123' }]
      }
    };
    const errors = validator._collectCookieErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'CookieURL');
    assert.match(errors[0].message, /required because useCDP is `false`/);
  });

  it('returns error if CookieURL is present when useCDP is true', () => {
    const data = {
      name: 'TestScraper',
      driver: {
        useCDP: true,
        cookies: [{ name: 'session', value: '123', CookieURL: 'https://example.com' }]
      }
    };
    const errors = validator._collectCookieErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'CookieURL');
    assert.match(errors[0].message, /Should not have `CookieURL` because useCDP is `true`/);
  });

  it('returns no errors for valid cookie configurations', () => {
    const cdpValid = {
      name: 'TestScraper',
      driver: {
        useCDP: true,
        cookies: [{ name: 'session', value: '123' }]
      }
    };
    assert.deepEqual(validator._collectCookieErrors(cdpValid), []);

    const nonCdpValid = {
      name: 'TestScraper',
      driver: {
        useCDP: false,
        cookies: [{ name: 'session', value: '123', CookieURL: 'https://example.com' }]
      }
    };
    assert.deepEqual(validator._collectCookieErrors(nonCdpValid), []);
  });
});

describe('Validator Method: run', () => {
  it('validates a valid scraper file', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'validator-test-run-'));
    try {
      const validScraperPath = path.join(tmpDir, 'TestScraper.yml');
      const validYaml = `
name: TestScraper
sceneByURL:
  - action: scrapeXPath
    scraper: myScraper
    url:
      - https://example.com/a
xPathScrapers:
  myScraper:
    scene:
      Title:
        selector: //title
`;
      fs.writeFileSync(validScraperPath, validYaml);

      const validator = new Validator(['-a']);
      const result = validator.run([validScraperPath]);
      assert.equal(result, true);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('handles invalid YAML file gracefully and fails validation', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'validator-test-run-invalid-'));
    try {
      const invalidPath = path.join(tmpDir, 'Invalid.yml');
      fs.writeFileSync(invalidPath, 'name: [invalid yaml');

      const validator = new Validator(['-a']);
      const result = validator.run([invalidPath]);
      assert.equal(result, false);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('fails validation when custom mapping errors are present', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'validator-test-mapping-err-'));
    try {
      const scraperPath = path.join(tmpDir, 'MappingError.yml');
      const yamlContent = `
name: MappingErrorScraper
sceneByName:
  action: scrapeXPath
  scraper: myScraper
xPathScrapers:
  myScraper:
    scene:
      Title:
        selector: //title
`;
      fs.writeFileSync(scraperPath, yamlContent);

      const validator = new Validator(['-a']);
      const result = validator.run([scraperPath]);
      assert.equal(result, false);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
