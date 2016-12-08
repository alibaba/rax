'use strict';

import traverseImport from '../TraverseImport';

describe('PlatformLoader.traverseImport', function() {
  it('isWeex true ', function() {

    const { code } = traverseImport(
      { name: 'universal-env', platform: 'weex' },
      'import { isWeex } from "universal-env";'
    );

    expect(code).toBe('const isWeex = true;');
  });

  it('isWeex as iw ', function() {

    const { code } = traverseImport(
      { name: 'universal-env', platform: 'weex' },
      'import { isWeex as iw } from "universal-env";'
    );

    expect(code).toBe(
`const iw = true;
const isWeex = true;`
    );
  });

  it('isWeex and isWeb', function() {

    const { code } = traverseImport(
      { name: 'universal-env', platform: 'weex' },
      'import { isWeex, isWeb } from "universal-env";'
    );

    expect(code).toBe(
`const isWeb = false;
const isWeex = true;`
    );
  });

  it('isWeb true', function() {

    const { code } = traverseImport(
      { name: 'universal-env', platform: 'web' },
      'import { isWeb } from "universal-env";'
    );

    expect(code).toBe('const isWeb = true;');
  });

  it('skin other module', function() {

    const { code } = traverseImport(
      { name: 'universal-env', platform: 'web' },
`import { isWeb } from "universal-env";
import { XXX } from "universal-other";
`
    );

    expect(code).toBe(
`const isWeb = true;

import { XXX } from "universal-other";`);
  });

  it('not platform define', function() {

    const { code } = traverseImport(
      { name: 'universal-env'},
      'import { isWeex, isWeb } from "universal-env";'
    );

    expect(code).toBe('import { isWeex, isWeb } from "universal-env";');
  });

  it('unkonw platform', function() {

    const { code } = traverseImport(
      { name: 'universal-env', platform: 'xxxx'},
      'import { isWeex, isWeb } from "universal-env";'
    );

    expect(code).toBe('import { isWeex, isWeb } from "universal-env";');
  });
});
