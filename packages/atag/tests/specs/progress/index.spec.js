describe('a-progress', function() {
  const progress = document.createElement('a-progress');

  it('render a progress', done => {
    progress.setAttribute('percent', 80);
    progress.setAttribute('stroke-width', 10);
    progress.setAttribute('active-color', 'rgb(0, 0, 0)');
    progress.setAttribute('background-color', 'rgb(255, 255, 255)');
    document.body.appendChild(progress);
    expect(progress).to.not.be.an.instanceOf(HTMLUnknownElement);
    const activeBar = progress.shadowRoot.getElementById('active');
    const style = activeBar.style;
    expect(style.height).to.equal('10px');
    expect(style.width).to.equal('80%');
    expect(style.backgroundColor).to.equal('rgb(0, 0, 0)');
    const container = progress.shadowRoot.getElementById('container');
    expect(container.style.backgroundColor).to.equal('rgb(255, 255, 255)');
    done();
  });
  it('render a active progress', done => {
    progress.setAttribute('active', true);
    progress.setAttribute('percent', 40);
    document.body.appendChild(progress);
    const activeBar = progress.shadowRoot.getElementById('active');
    expect(activeBar.style.width).to.equal('0%');
    setTimeout(() => {
      expect(activeBar.style.width).to.equal('40%');
      done();
    }, 100);
  });
});
