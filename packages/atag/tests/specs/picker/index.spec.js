describe('<a-picker>', () => {
  it('should render a-picker', () => {
    const el = document.createElement('a-picker');
    expect(el).to.not.be.an.instanceOf(HTMLUnknownElement);
  });

  it('support array', (done) => {
    const el = document.createElement('a-picker');

    const array = ['one', 'two', 'three'];

    el.setAttribute('range', JSON.stringify(array));
    el.setAttribute('value', 1);
    document.body.appendChild(el);

    // el.click();
    setTimeout(() => {
      expect(el.shadowRoot.querySelectorAll('.item').length).to.equal(3);
      expect(el.shadowRoot.querySelectorAll('.item')[0].textContent).to.equal('one');
      done();
      document.body.removeChild(el);
    }, 100);
  });

  it('support object array', (done) => {
    const el = document.createElement('a-picker');

    const objArray = [
      { name: 'one' },
      { name: 'two' },
      { name: 'three' }
    ];

    el.setAttribute('range', JSON.stringify(objArray));
    el.setAttribute('range-key', 'name');
    el.setAttribute('value', 1);
    document.body.appendChild(el);

    // el.click();
    setTimeout(() => {
      expect(el.shadowRoot.querySelectorAll('.item').length).to.equal(3);
      expect(el.shadowRoot.querySelectorAll('.item')[0].textContent).to.equal('one');
      done();
      document.body.removeChild(el);
    }, 100);
  });
});
