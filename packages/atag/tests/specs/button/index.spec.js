describe('<a-button>', () => {
  it('should render a-button', () => {
    const el = document.createElement('a-button');
    el.innerText = 'Hello World';
    document.body.appendChild(el);
    expect(el).to.not.be.an.instanceOf(HTMLUnknownElement);
    expect(getComputedStyle(el).display).to.equal('block');
  });

  it('should render warn button', () => {
    const el = document.createElement('a-button');
    el.innerText = 'Warn Button';
    el.setAttribute('type', 'warn');
    document.body.appendChild(el);

    expect(
      getComputedStyle(el.shadowRoot.querySelector('div')).backgroundColor
    ).to.equal('rgb(230, 67, 64)');
  });

  it('should render mini button', () => {
    const el = document.createElement('a-button');
    el.innerText = 'Mini Button';
    el.setAttribute('size', 'mini');
    document.body.appendChild(el);
    expect(getComputedStyle(el).display).to.equal('inline-block');
  });

  it('should render plain button', () => {
    const el = document.createElement('a-button');
    el.innerText = 'Plain Button';
    el.setAttribute('plain', 'true');
    document.body.appendChild(el);
    expect(
      getComputedStyle(el.shadowRoot.querySelector('div')).backgroundColor
    ).to.equal('rgba(0, 0, 0, 0)');
  });

  it('should render disabled button', () => {
    const el = document.createElement('a-button');
    el.innerText = 'Disabled Button';
    el.setAttribute('disabled', 'true');
    document.body.appendChild(el);
    expect(
      getComputedStyle(el.shadowRoot.querySelector('div')).pointerEvents
    ).to.equal('none');
  });
});
