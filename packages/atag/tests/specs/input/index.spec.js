describe('<a-input>', function() {
  const input = document.createElement('a-input');

  it('render an a-input', () => {
    document.body.appendChild(input);
    expect(input).to.not.be.an.instanceOf(HTMLUnknownElement);
  });

  it('render an a-input with red placeholder', () => {
    input.setAttribute('placeholder-style', 'color: red;');
    document.body.appendChild(input);
    const shadow = input.shadowRoot;
    const shadowStyle = shadow.querySelector('style');
    expect(shadowStyle.innerHTML.indexOf('::placeholder') > -1).equal(true);
  });
});
