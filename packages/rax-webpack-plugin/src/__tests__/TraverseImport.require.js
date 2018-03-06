'use strict';

import traverseImport from '../TraverseImport';

// Remove padding from a string.
function unpad(str) {
  const lines = str.split('\n');
  const m = lines[1] && lines[1].match(/^\s+/);
  if (!m) {
    return str;
  }
  const spaces = m[0].length;
  return lines.map(
    line => line.slice(spaces)
  ).join('\n').trim();
}

describe('PlatformLoader.traverseImport work on CommonJS', function() {
  it('isWeex true', function() {
    const { code } = traverseImport(
      { name: 'universal-env', platform: 'weex' },
      'const env = require("universal-env");'
    );

    const expected = unpad(`
      const env = {
        isWeex: true,
        isWeb: false,
        isNode: false,
        isReactNative: false
      };
    `);

    expect(code).toBe(expected);
  });

  it('isWeex as iw', function() {
    const { code } = traverseImport(
      { name: 'universal-env', platform: 'weex' },
      unpad(`
        const env = require("universal-env");
        const iw = env.isWeex;
      `)
    );

    const expected = unpad(`
      const env = {
        isWeex: true,
        isWeb: false,
        isNode: false,
        isReactNative: false
      };
      const iw = env.isWeex;
    `);

    expect(code).toBe(expected);
  });

  it('multiple module name', function() {
    const { code } = traverseImport(
      { name: ['universal-env', 'other-env'], platform: 'weex' },
      unpad(`
        const env = require("other-env");
        const env2 = require("universal-env");
      `)
    );

    const expected = unpad(`
      const env = {
        isWeex: true,
        isWeb: false,
        isNode: false,
        isReactNative: false
      };
      const env2 = {
        isWeex: true,
        isWeb: false,
        isNode: false,
        isReactNative: false
      };
    `);

    expect(code).toBe(expected);
  });

  it('skin other module', function() {
    const { code } = traverseImport(
      { name: 'universal-env', platform: 'web' },
      unpad(`
        const xxx = require("universal-env").xxx;
      `)
    );

    const expected = unpad(`
      const xxx = {
        isWeex: false,
        isWeb: true,
        isNode: false,
        isReactNative: false
      }.xxx;
    `);

    expect(code).toBe(expected);
  });

  it('not platform specified', function() {
    const { code } = traverseImport(
      { name: 'universal-env'},
      'const env = require("universal-env");'
    );

    const expected = 'const env = require("universal-env");';

    expect(code).toBe(expected);
  });

  it('unknown platform', function() {
    const { code } = traverseImport(
      { name: 'universal-env', platform: 'xxxx'},
      'const env = require("universal-env");'
    );

    const expected = 'const env = require("universal-env");';

    expect(code).toBe(expected);
  });

  it('unknown platform and unknown name', function() {
    const { code } = traverseImport(
      { name: 'universal-xxx'},
      'const env = require("universal-env");'
    );

    expect(code).toBe('const env = require("universal-env");');
  });
});
