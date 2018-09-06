describe('<a-checkbox> and <a-checkbox-group>', () => {
  it('should render a-checkbox', () => {
    const el = document.createElement('a-checkbox');
    expect(el).to.not.be.an.instanceOf(HTMLUnknownElement);
  });
  it('should render a-checkbox-group', () => {
    const el = document.createElement('a-checkbox-group');
    expect(el).to.not.be.an.instanceOf(HTMLUnknownElement);
  });

  it('can be checked as default', () => {
    const el = document.createElement('a-checkbox');
    el.setAttribute('value', 'yeah!');
    el.setAttribute('checked', 'checked');
    document.body.appendChild(el);

    el.click();

    expect(el.checked).to.equal(false);

    document.body.removeChild(el);
  });

  it('can be disabled as default', () => {
    const el = document.createElement('a-checkbox');
    el.setAttribute('value', 'yeah!');
    el.setAttribute('checked', 'checked');
    el.setAttribute('disabled', 'disabled');
    document.body.appendChild(el);

    el.click();

    expect(el.checked).to.equal(true);

    document.body.removeChild(el);
  });

  it('can change disable status', () => {
    const el = document.createElement('a-checkbox');
    el.setAttribute('value', 'yeah!');
    el.setAttribute('checked', 'checked');
    el.setAttribute('disabled', 'disabled');
    document.body.appendChild(el);

    el.click();
    expect(el.checked).to.equal(true);

    el.removeAttribute('disabled');
    el.click();
    expect(el.checked).to.equal(false);

    document.body.removeChild(el);
  });

  it('will fire change event when clicked', (done) => {
    const el = document.createElement('a-checkbox');
    el.setAttribute('value', 'yeah!');

    el.addEventListener('change', e => {
      expect(e.detail.value).to.equal(true);
      document.body.removeChild(el);
      done();
    });
    document.body.appendChild(el);
    el.click();
  });

  it('will fire change event when clicked (<a-checkbox-group>)', (done) => {
    const elGroup = document.createElement('a-checkbox-group');
    const el = document.createElement('a-checkbox');
    el.setAttribute('value', 'yeah!');
    const el2 = document.createElement('a-checkbox');
    el2.setAttribute('value', 'whatever');
    const el3 = document.createElement('a-checkbox');
    el3.setAttribute('value', 'other');
    el3.setAttribute('checked', 'checked');

    elGroup.addEventListener('change', e => {
      expect(e.detail.value).to.eql(['yeah!', 'other']);
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
