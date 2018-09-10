describe('<a-text>', () => {
  it('should render a-text', () => {
    const el = document.createElement('a-text');
    expect(el).to.not.be.an.instanceOf(HTMLUnknownElement);
  });

  it('not selectable', () => {
    const el = document.createElement('a-text');
    el.innerText = 'Hello';
    document.body.appendChild(el);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNode(el);
    selection.removeAllRanges();
    selection.addRange(range);

    expect(document.getSelection().toString()).to.equal('');
  });

  it('selectable', () => {
    const el = document.createElement('a-text');
    el.setAttribute('selectable', true);
    el.innerText = 'World';

    const selection = window.getSelection();
    const range = document.createRange();
    document.body.appendChild(el);
    el.offsetWidth;

    range.selectNode(el);
    selection.removeAllRanges();
    selection.addRange(range);
    expect(document.getSelection().toString()).to.equal('World');
  });
});
