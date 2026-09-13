import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Validator } from './index.mjs';

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
