Page({
  data: {
    a: 1,
    b: 2,
    obj1: {
      a: 1,
      b: 2
    },
    obj2: {
      c: 3,
      d: 4
    }
  }
});

describe('render with template', () => {
  const cont = document.querySelector('[data-id="tests/specs/template/index"]');

  it('import works', () => {
    expect(cont.querySelector('.import').innerHTML)
      .to.equal(`<view>forbar</view> <view> A template </view> <!-- empty --> <view> A template </view> <view> B template </view>`);
  });

  it('include works', () => {
    expect(cont.querySelector('.include').innerHTML)
      .to.equal(`<view> header </view> <view> body </view> <view> footer </view>`);
  });

  it('import data pass', () => {
    expect(cont.querySelector('.obj-data-pass').innerText.trim())
      .to.equal(`1 2 1 2 3 4 5 5 2 6 4 9`);
  });

  it('动态模板渲染', () => {
    expect(cont.querySelector('.dynamic-render').innerText.trim())
      .to.equal('odd even odd even odd')
  });
});
