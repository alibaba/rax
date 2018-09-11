describe('<a-icon>', () => {
  it('should render a-icon', done => {
    const el = document.createElement('a-icon');
    el.setAttribute('color', 'green');
    el.setAttribute('type', 'success');
    document.body.appendChild(el);
    expect(el).to.not.be.an.instanceOf(HTMLUnknownElement);

    setTimeout(() => {
      el.setAttribute('type', 'warn');
      done();
    }, 200);
  });
});
