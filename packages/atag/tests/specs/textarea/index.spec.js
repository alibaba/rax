describe('<a-textarea>', function() {
  const textarea = document.createElement('a-textarea');
  it('render an a-textarea', () => {
    expect(textarea).to.not.be.an.instanceOf(HTMLUnknownElement);
  });

  it('render an a-textarea with red placeholder', () => {
    textarea.setAttribute('placeholder-style', 'color: red;');
    document.body.appendChild(textarea);
    const shadow = textarea.shadowRoot;
    const shadowStyle = shadow.querySelector('style');
    expect(shadowStyle.innerHTML.indexOf('::placeholder') > -1).equal(true);
  });
});
