const { CLIEngine } = require('eslint');
const eslintrc = require('..');

const cli = new CLIEngine({
  useEslintrc: false,
  baseConfig: eslintrc,
});

function lint(text) {
  // @see https://eslint.org/docs/developer-guide/nodejs-api.html#executeonfiles
  // @see https://eslint.org/docs/developer-guide/nodejs-api.html#executeontext
  const linter = cli.executeOnText(unpad(text));
  return linter.results[0];
}

function unpad(str) {
  const lines = str.split('\n');
  const m = lines[1] && lines[1].match(/^\s+/);
  if (!m) {
    return str;
  }
  const spaces = m[0].length;
  return lines
    .map((line) => line.slice(spaces))
    .join('\n')
    .trim();
}

describe('eslint working', () => {
  it('eslint working', () => {
    const e = lint(`
      console.log(1)
    `);
    expect(e.errorCount).toBe(0);
    expect(e.warningCount).toBe(0);
  });
});

describe('object', () => {
  it('Object.getOwnPropertySymbols', () => {
    const e = lint(`
      Object.getOwnPropertySymbols({});
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
  it('Object.getOwnPropertySymbols', () => {
    const e = lint(`
      Object.setPrototypeOf({}, null);
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
});

describe('number', () => {
  it('Number.isNaN', () => {
    const e = lint(`
    Number.isNaN(1);
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
  it('Number.isSafeInteger', () => {
    const e = lint(`
    Number.isSafeInteger(1);
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
  it('Number.parseFloat', () => {
    const e = lint(`
    Number.parseFloat(1);
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
  it('Number.parseInt', () => {
    const e = lint(`
    Number.parseInt(1);
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
});

describe('string', () => {
  it('String.raw', () => {
    const e = lint(`
      String.raw({
        raw: ['foo', 'bar', 'baz']
      }, 2 + 3, 'Java' + 'Script');
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
  it('String.fromCodePoint', () => {
    const e = lint(`
      String.fromCodePoint(9731, 9733, 9842, 0x2F804)
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
  it('String.prototype.normalize', () => {
    const e = lint(`
      'foo'.normalize()
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
});

describe('array methods', () => {
  it('Array.prototype.copyWithin', () => {
    const e = lint(`
      array1.copyWithin(0, 3, 4)
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
  it('Array.prototype.keys', () => {
    const e = lint(`
      array1.keys()
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
  it('Array.prototype.values', () => {
    const e = lint(`
      array1.values()
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
  it('Array.prototype.entries', () => {
    const e = lint(`
      array1.entries()
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
  it('Array.prototype.includes', () => {
    const e = lint(`
      array1.includes(0)
    `);
    expect(e.errorCount).toBe(0);
    expect(e.warningCount).toBe(0);
  });
});

describe('class', () => {
  it('WeakSet', () => {
    const e = lint(`
      new WeakSet()
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
  it('Feflect', () => {
    const e = lint(`
      var obj = { x: 1, y: 2 };
      Reflect.get(obj, "x"); // 1
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
  it('Proxy', () => {
    const e = lint(`
      var handler = {
          get: function(obj, prop) {
              return prop in obj ?
                  obj[prop] :
                  37;
          }
      };

      var p = new Proxy({}, handler);
      p.a = 1;
      p.b = undefined;

      console.log(p.a, p.b); // 1, undefined
      console.log('c' in p, p.c); // false, 37
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
  it('Symbol', () => {
    const e = lint(`
      const symbol2 = Symbol(42)
    `);
    expect(e.errorCount).toBe(1);
    expect(e.warningCount).toBe(0);
  });
});
