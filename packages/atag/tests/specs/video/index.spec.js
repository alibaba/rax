describe('<a-video>', () => {
  it('should render a-video', () => {
    const el = document.createElement('a-video');
    document.body.appendChild(el);
    expect(el).to.not.be.an.instanceOf(HTMLUnknownElement);
    expect(getComputedStyle(el).display).to.equal('inline');
  });
});
