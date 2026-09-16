import assert from "node:assert/strict";
import { test, describe } from "node:test";
import { Validator } from "./index.mjs";

// ===== 來自 main 的 getMappingErrors 測試 =====
describe('Validator.getMappingErrors', () => {
  it('returns an empty array when data is valid and has no mapping errors', () => {
    const validator = new Validator([]);
    const data = {
      sceneByURL: {
        action: 'scrapeXPath',
        scraper: 'myScraper',
      },
      xPathScrapers: {
        myScraper: {
          scene: {},
        },
      },
    };

    const errors = validator.getMappingErrors(data);
    assert.deepEqual(errors, []);
  });

  it('collects config mapping errors (e.g. sceneByName without sceneByQueryFragment)', () => {
    const validator = new Validator([]);
    const data = {
      sceneByName: {
        action: 'scrapeXPath',
        scraper: 'myScraper',
      },
      xPathScrapers: {
        myScraper: {
          scene: {},
        },
      },
    };

    const errors = validator.getMappingErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'sceneByName');
    assert.match(
      errors[0].message,
      /sceneByQueryFragment.*required for.*sceneByName/
    );
  });

  it('collects scraper definition errors when action is stash but stashServer is missing', () => {
    const validator = new Validator([]);
    const data = {
      sceneByURL: {
        action: 'stash',
      },
    };

    const errors = validator.getMappingErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'action');
    assert.match(errors[0].message, /stashServer/);
  });

  it('collects scraper definition error when stashServer is defined but never used', () => {
    const validator = new Validator([]);
    const data = {
      stashServer: { url: 'https://stash.example.com' },
      sceneByURL: {
        action: 'scrapeXPath',
        scraper: 'myScraper',
      },
      xPathScrapers: {
        myScraper: {
          scene: {},
        },
      },
    };

    const errors = validator.getMappingErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'stashServer');
    assert.match(errors[0].message, /never used/);
  });

  it('collects scraper definition errors when referenced XPath scraper is missing', () => {
    const validator = new Validator([]);
    const data = {
      sceneByURL: {
        action: 'scrapeXPath',
        scraper: 'nonExistentScraper',
      },
    };

    const errors = validator.getMappingErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'scraper');
    assert.match(errors[0].message, /nonExistentScraper/);
  });

  it('collects scraper definition errors when XPath scraper creates mismatched entity type', () => {
    const validator = new Validator([]);
    const data = {
      sceneByURL: {
        action: 'scrapeXPath',
        scraper: 'myScraper',
      },
      xPathScrapers: {
        myScraper: {
          performer: {},
        },
      },
    };

    const errors = validator.getMappingErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'myScraper');
    assert.match(errors[0].message, /should create an object of type `scene`/);
  });

  it('collects scraper definition errors when referenced JSON scraper is missing', () => {
    const validator = new Validator([]);
    const data = {
      sceneByURL: {
        action: 'scrapeJson',
        scraper: 'nonExistentJsonScraper',
      },
    };

    const errors = validator.getMappingErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'scraper');
    assert.match(errors[0].message, /nonExistentJsonScraper/);
  });

  it('collects scraper definition errors when JSON scraper creates mismatched entity type', () => {
    const validator = new Validator([]);
    const data = {
      performerByURL: {
        action: 'scrapeJson',
        scraper: 'myJsonScraper',
      },
      jsonScrapers: {
        myJsonScraper: {
          scene: {},
        },
      },
    };

    const errors = validator.getMappingErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'myJsonScraper');
    assert.match(errors[0].message, /should create an object of type `performer`/);
  });

  it('supports array mapping entries for scrapeJson and detects duplicate URLs', () => {
    const validator = new Validator([]);
    const data = {
      sceneByURL: [
        {
          action: 'scrapeJson',
          scraper: 'myJsonScraper',
          url: ['https://example.com/a', 'https://example.com/b'],
        },
        {
          action: 'scrapeJson',
          scraper: 'myJsonScraper',
          url: ['https://example.com/b', 'https://example.com/c'],
        },
      ],
      jsonScrapers: {
        myJsonScraper: {
          scene: {},
        },
      },
    };

    const errors = validator.getMappingErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'url');
    assert.match(errors[0].message, /already exists/);
  });

  it('collects scraper definition errors when duplicate URLs are specified', () => {
    const validator = new Validator([]);
    const data = {
      sceneByURL: {
        action: 'scrapeXPath',
        scraper: 'myScraper',
        url: ['https://example.com/a', 'https://example.com/a'],
      },
      xPathScrapers: {
        myScraper: {
          scene: {},
        },
      },
    };

    const errors = validator.getMappingErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'url');
    assert.match(errors[0].message, /already exists/);
  });

  it('collects URL sorting errors when sortedURLs (-s) flag is active', () => {
    const validator = new Validator(['-s']);
    const data = {
      sceneByURL: {
        action: 'scrapeXPath',
        scraper: 'myScraper',
        url: ['https://example.com/z', 'https://example.com/a'],
      },
      xPathScrapers: {
        myScraper: {
          scene: {},
        },
      },
    };

    const errors = validator.getMappingErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'url');
    assert.match(errors[0].message, /sorted in ascending alphabetical order/);
  });

  it('returns no cookie errors for valid CDP and non-CDP cookie definitions', () => {
    const validator = new Validator([]);
    const cdpValid = {
      driver: {
        useCDP: true,
        cookies: [{ Key: 'session', Value: '123' }],
      },
    };
    assert.deepEqual(validator.getMappingErrors(cdpValid), []);

    const nonCdpValid = {
      driver: {
        useCDP: false,
        cookies: [{ Key: 'session', Value: '123', CookieURL: 'https://example.com' }],
      },
    };
    assert.deepEqual(validator.getMappingErrors(nonCdpValid), []);
  });

  it('collects cookie errors when CookieURL is missing and useCDP is false', () => {
    const validator = new Validator([]);
    const data = {
      driver: {
        useCDP: false,
        cookies: [{ Key: 'session', Value: '123' }],
      },
    };

    const errors = validator.getMappingErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'CookieURL');
    assert.match(errors[0].message, /required because useCDP is `false`/);
  });

  it('collects cookie errors when CookieURL is present and useCDP is true', () => {
    const validator = new Validator([]);
    const data = {
      driver: {
        useCDP: true,
        cookies: [{ Key: 'session', Value: '123', CookieURL: 'https://example.com' }],
      },
    };

    const errors = validator.getMappingErrors(data);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].keyword, 'CookieURL');
    assert.match(errors[0].message, /Should not have `CookieURL` because useCDP is `true`/);
  });

  it('concatenates config, scraper definition, and cookie errors in exact order', () => {
    const validator = new Validator([]);
    const data = {
      sceneByName: {
        action: 'stash',
      },
      driver: {
        useCDP: false,
        cookies: [{ Key: 'session', Value: '123' }],
      },
    };

    const errors = validator.getMappingErrors(data);
    assert.equal(errors.length, 3);
    // 1st: _collectConfigMappingErrors
    assert.equal(errors[0].keyword, 'sceneByName');
    // 2nd: _collectScraperDefinitionErrors
    assert.equal(errors[1].keyword, 'action');
    // 3rd: _collectCookieErrors
    assert.equal(errors[2].keyword, 'CookieURL');
  });

  it('handles empty data object gracefully without throwing errors', () => {
    const validator = new Validator([]);
    const errors = validator.getMappingErrors({});
    assert.deepEqual(errors, []);
  });
});

// ===== 你新增的 _collectConfigMappingErrors 測試 =====
describe("Validator - _collectConfigMappingErrors", () => {
  const validator = new Validator(["-a"]);

  test("returns error when sceneByName is present but sceneByQueryFragment is missing", () => {
    const mockData = {
      name: "TestScraper",
      sceneByName: {
        action: "scrapeXPath",
        scraper: "test",
      },
    };

    const errors = validator._collectConfigMappingErrors(mockData);

    assert.strictEqual(errors.length, 1);
    assert.deepStrictEqual(errors[0], {
      keyword: "sceneByName",
      message: "a `sceneByQueryFragment` configuration is required for `sceneByName` to work",
      params: { keyword: "sceneByName" },
      dataPath: "/sceneByName",
    });
  });

  test("returns no errors when both sceneByName and sceneByQueryFragment are present", () => {
    const mockData = {
      name: "TestScraper",
      sceneByName: {
        action: "scrapeXPath",
        scraper: "test",
      },
      sceneByQueryFragment: {
        action: "scrapeXPath",
        scraper: "test",
      },
    };

    const errors = validator._collectConfigMappingErrors(mockData);

    assert.strictEqual(errors.length, 0);
  });

  test("returns no errors when sceneByName is not present", () => {
    const mockData = {
      name: "TestScraper",
      sceneByURL: [
        {
          action: "scrapeXPath",
          scraper: "test",
        },
      ],
    };

    const errors = validator._collectConfigMappingErrors(mockData);

    assert.strictEqual(errors.length, 0);
  });

  test("returns no errors for an empty data object", () => {
    const errors = validator._collectConfigMappingErrors({});

    assert.strictEqual(errors.length, 0);
  });

  test("getMappingErrors includes _collectConfigMappingErrors results", () => {
    const mockData = {
      name: "TestScraper",
      sceneByName: {
        action: "scrapeXPath",
        scraper: "test",
      },
    };

    const errors = validator.getMappingErrors(mockData);

    const configErrors = errors.filter((err) => err.keyword === "sceneByName");
    assert.strictEqual(configErrors.length, 1);
    assert.strictEqual(
      configErrors[0].message,
      "a `sceneByQueryFragment` configuration is required for `sceneByName` to work",
    );
  });
});