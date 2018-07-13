Page({});

describe('basic render', () => {
  const basicContainer = document.querySelector('[data-id="tests/specs/basic/index"]');

  it('should render axml', () => {
    expect(basicContainer.innerText).to.equal('hello world');
  });

  it('should render acss', () => {
    expect(
      basicContainer.querySelector('.container').style.color
    ).to.equal('red');
  });
});