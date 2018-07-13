Page({ /* eslint-disable-line */
  data: {
    obj: {
      a: 1,
      b: 'text',
      c: {
        d: '2'
      }
    },
    arr: [
      '1', '2', '3', '4', '5'
    ],
    arr2: [{
      message: 'foo',
    }, {
      message: 'bar'
    }],

    view: 'alipay',

    flag: false,
    a: 1, b: 1, c: 2,

    name: 'zeroling',

    zero: 0,
  }
});

describe('render with data', () => {
  const cont = document.querySelector('[data-id="tests/specs/data/index"]');

  it('binding', () => {
    expect(
      cont.firstElementChild.firstElementChild.children[0].innerText
    ).to.equal('Number: 1');

    expect(
      cont.firstElementChild.firstElementChild.children[1].innerText
    ).to.equal('String: text');

    expect(
      cont.firstElementChild.firstElementChild.children[2].innerText
    ).to.equal('Deep Obj: 2');
  });

  it('a:for bacis list render', () => {
    expect(
      cont.firstElementChild.firstElementChild.children[3].innerText
    ).to.equal('1 2 3 4 5 ');
  });


  it('a:for a:for-item a:for-index list render', () => {
    expect(
      cont.querySelector('.list-render-2').innerText
    ).to.equal('0: foo1: bar');
  });

  it('9x9 乘法表', () => {
    expect(
      cont.querySelector('.complex-list').innerText
    ).to.equal('1 * 1 = 1 1 * 2 = 2 1 * 3 = 3 1 * 4 = 4 1 * 5 = 5 1 * 6 = 6 1 * 7 = 7 1 * 8 = 8 1 * 9 = 9 2 * 2 = 4 2 * 3 = 6 2 * 4 = 8 2 * 5 = 10 2 * 6 = 12 2 * 7 = 14 2 * 8 = 16 2 * 9 = 18 3 * 3 = 9 3 * 4 = 12 3 * 5 = 15 3 * 6 = 18 3 * 7 = 21 3 * 8 = 24 3 * 9 = 27 4 * 4 = 16 4 * 5 = 20 4 * 6 = 24 4 * 7 = 28 4 * 8 = 32 4 * 9 = 36 5 * 5 = 25 5 * 6 = 30 5 * 7 = 35 5 * 8 = 40 5 * 9 = 45 6 * 6 = 36 6 * 7 = 42 6 * 8 = 48 6 * 9 = 54 7 * 7 = 49 7 * 8 = 56 7 * 9 = 63 8 * 8 = 64 8 * 9 = 72 9 * 9 = 81 ');
  });

  it('a:if conditional render', () => {
    expect(cont.firstElementChild.firstElementChild.children[6].innerText.trim())
      .to.equal('alipay');
  });

  it('行内三元表达式', () => {
    expect(cont.firstElementChild.firstElementChild.children[7].checked
    ).to.not.be.ok;
  });

  it('算数表达式', () => {
    expect(
      cont.querySelector('.digital-calc').innerText.trim()
    ).to.equal('2 + 2 + d');
  });

  it('字符串运算', () => {
    expect(cont.querySelector('.text-calc').innerText.trim())
      .to.equal('hellozeroling');
  });

  it('路径运算', () => {
    expect(cont.querySelector('.path-calc').innerText.trim())
      .to.equal('2 foo');
  });

  it('在 Mustache 内直接进行组合，构成新的数组或者对象', () => {
    expect(cont.querySelector('.inline-var-mixin').innerText.trim())
      .to.equal('0 1 2 3 4');
  });
});
