'use strict';

import traverseImport from '../TraverseImport';

describe('PlatformLoader.traverseImport', function() {
  it('isWeex true ', function() {

    const { code } = traverseImport(
      { name: 'universal-env', isWeex: true },
      'import { isWeex } from "universal-env";'
    );

    expect(code).toBe('const isWeex = true;');
  });

  it('isWeex as iw ', function() {

    const { code } = traverseImport(
      { name: 'universal-env', isWeex: true },
      'import { isWeex as iw } from "universal-env";'
    );

    expect(code).toBe(
`const iw = true;
const isWeex = true;`
    );
  });

  it('isWeex and isWeb', function() {

    const { code } = traverseImport(
      { name: 'universal-env', isWeex: true },
      'import { isWeex, isWeb } from "universal-env";'
    );

    expect(code).toBe(
`const isWeb = false;
const isWeex = true;`
    );
  });

  it('isBundle', function() {

    const { code } = traverseImport(
      { name: 'universal-env', isBundle: true },
      'import { isWeex, isWeb } from "universal-env";'
    );

    expect(code).toBe('import { isWeex, isWeb } from "universal-env";');
  });

  it('not platform define', function() {

    const { code } = traverseImport(
      { name: 'universal-env'},
      'import { isWeex, isWeb } from "universal-env";'
    );

    expect(code).toBe('import { isWeex, isWeb } from "universal-env";');
  });
});
