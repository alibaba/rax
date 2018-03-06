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

describe('PlatformLoader.traverseImport', function() {
  it('isWeex true', function() {
    const { code } = traverseImport(
      { name: 'universal-env', platform: 'weex' },
      'import { isWeex } from "universal-env";'
    );

    expect(code).toBe('const isWeex = true;');
  });

  it('sourcemap', function() {
    const { map, code } = traverseImport(
      { name: 'universal-env', platform: 'weex' },
      'import { isWeex } from "universal-env";\n let a = 1;',
      { sourceMaps: true,
        filename: 'inline',
        sourceFileName: 'inline'}
    );
    let sourceMapObj = {
      'version': 3,
      'sources': ['inline'],
      'names': ['a'],
      'mappings': ';;AACC,IAAIA,IAAI,CAAR',
      'sourcesContent': ['import { isWeex } from "universal-env";\n let a = 1;']
    };
    expect(map).toMatchObject(sourceMapObj);
  });


  it('support star syntax by ImportNamespaceSpecifier', function() {
    const { code } = traverseImport(
      { name: 'universal-env', platform: 'weex' },
      unpad(`
        import * as env from 'universal-env'
      `)
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
      'import { isWeex as iw } from "universal-env";'
    );

    const expected = unpad(`
      const iw = true;
      const isWeex = true;
    `);

    expect(code).toBe(expected);
  });

  it('isWeex and isWeb', function() {
    const { code } = traverseImport(
      { name: 'universal-env', platform: 'weex' },
      'import { isWeex, isWeb } from "universal-env";'
    );

    const expected = unpad(`
      const isWeb = false;
      const isWeex = true;
    `);

    expect(code).toBe(expected);
  });

  it('isWeb true', function() {
    const { code } = traverseImport(
      { name: 'universal-env', platform: 'web' },
      'import { isWeb } from "universal-env";'
    );

    expect(code).toBe('const isWeb = true;');
  });

  it('multiple module name', function() {
    const {code} = traverseImport(
      { name: ['universal-env', 'other-env'], platform: 'web' },
      unpad(`
        import { isWeb } from "other-env";
        import { isWeex } from "universal-env";
      `)
    );

    const expected = unpad(`
      const isWeb = true;
      const isWeex = false;
    `);

    expect(code).toBe(expected);
  });

  it('skin other module', function() {
    const { code } = traverseImport(
      { name: 'universal-env', platform: 'web' },
      unpad(`
        import { isWeb } from "universal-env";
        import { XXX } from "universal-other";
      `)
    );

    const expected = unpad(`
      const isWeb = true;

      import { XXX } from "universal-other";
    `);

    expect(code).toBe(expected);
  });

  it('not platform specified', function() {
    const { code } = traverseImport(
      { name: 'universal-env'},
      'import { isWeex, isWeb } from "universal-env";'
    );

    expect(code).toBe('import { isWeex, isWeb } from "universal-env";');
  });

  it('unknown platform', function() {
    const { code } = traverseImport(
      { name: 'universal-env', platform: 'xxxx'},
      'import { isWeex, isWeb } from "universal-env";'
    );

    expect(code).toBe('import { isWeex, isWeb } from "universal-env";');
  });

  it('unknown platform and unknown name', function() {
    const { code } = traverseImport(
      { name: 'universal-xxx'},
      'import { isWeex, isWeb } from "universal-env";'
    );

    expect(code).toBe('import { isWeex, isWeb } from "universal-env";');
  });
});
