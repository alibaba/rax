describe('<a-radio> and <a-radio-group>', () => {
  it('should render a-radio', () => {
    const el = document.createElement('a-radio');
    expect(el).to.not.be.an.instanceOf(HTMLUnknownElement);
  });
  it('should render a-radio-group', () => {
    const el = document.createElement('a-radio-group');
    expect(el).to.not.be.an.instanceOf(HTMLUnknownElement);
  });

  it('can be checked as default', () => {
    const el = document.createElement('a-radio');
    el.setAttribute('value', 'yeah!');
    el.setAttribute('checked', 'checked');
    document.body.appendChild(el);

    expect(el.checked).to.equal(true);

    document.body.removeChild(el);
  });

  it('can be disabled as default', () => {
    const el = document.createElement('a-radio');
    el.setAttribute('value', 'yeah!');
    el.setAttribute('disabled', 'disabled');
    document.body.appendChild(el);

    el.click();

    expect(el.checked).to.equal(false);

    document.body.removeChild(el);
  });

  it('can change disable status', () => {
    const elGroup = document.createElement('a-radio-group');
    const el = document.createElement('a-radio');
    el.setAttribute('value', 'yeah!');
    el.setAttribute('disabled', 'disabled');
    const el2 = document.createElement('a-radio');
    el2.setAttribute('value', 'yeah!');
    el2.setAttribute('checked', 'checked');
    document.body.appendChild(el);

    el.click();
    expect(el.checked).to.equal(false);

    el.removeAttribute('disabled');
    el.click();
    expect(el.checked).to.equal(true);

    document.body.removeChild(el);
  });

  it('will fire change event when clicked (<a-radio-group>)', (done) => {
    const elGroup = document.createElement('a-radio-group');
    const el = document.createElement('a-radio');
    el.setAttribute('value', 'yeah!');
    const el2 = document.createElement('a-radio');
    el2.setAttribute('value', 'whatever');
    const el3 = document.createElement('a-radio');
    el3.setAttribute('value', 'other');
    el3.setAttribute('checked', 'checked');

    elGroup.addEventListener('change', e => {
      expect(e.detail.value).to.equal('yeah!');
      document.body.removeChild(elGroup);
      done();
    });
    elGroup.appendChild(el);
    elGroup.appendChild(el2);
    elGroup.appendChild(el3);
    document.body.appendChild(elGroup);
    el.click();
  });
});
