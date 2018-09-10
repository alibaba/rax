describe('<a-view>', function() {
  this.timeout(5000);

  it('render an a-view', done => {
    const view = document.createElement('a-view');
    expect(view).to.not.be.an.instanceOf(HTMLUnknownElement);

    done();
  });

  // after hover-start-time, dispatch touchEndEvt
  it('hover: touchEndEvt after hover-start-time', done => {
    const el = document.createElement('a-view');
    el.style = 'background-color: rgb(0,0,0); width: 100px; height: 100px;';
    el.setAttribute('hover-style', 'background-color: rgb(255,255,0);');

    document.body.appendChild(el);

    expect(getComputedStyle(el).backgroundColor).to.equal('rgb(0, 0, 0)');

    // wait 1500s, The previous pref instance runs to avoid affecting the timing of execution below
    setTimeout(() => {
      const touchStartEvt = new Event('touchstart');
      el.dispatchEvent(touchStartEvt);

      setTimeout(() => {
        expect(getComputedStyle(el).backgroundColor).to.equal(
          'rgb(255, 255, 0)'
        );
        const touchEndEvt = new Event('touchend');
        el.dispatchEvent(touchEndEvt);
        setTimeout(() => {
          expect(getComputedStyle(el).backgroundColor).to.equal('rgb(0, 0, 0)');
          done();
        }, 400);
      }, 50);
    }, 1500);
  });

  it('disable-scroll', done => {
    const el = document.createElement('a-view');
    el.style.height = '200px';
    el.style.backgroundColor = 'red';
    el.innerHTML = '<a-view style="height: 1000px;background-color: red"></a-view>';
    el.setAttribute('disable-scroll', true);
    document.body.appendChild(el);
    setTimeout(() => {
      const touchMoveEvt = new Event('touchmove', {
        cancelable: true
      });
      const result = el.dispatchEvent(touchMoveEvt);
      expect(result).to.equal(false);
      done();
    }, 30);
  });

  it('hover: hover-start-time after touchEndEvt', done => {
    const el = document.createElement('a-view');
    el.style = 'background-color: rgb(0,0,0); width: 100px; height: 100px;';
    el.setAttribute('hover-style', 'background-color: rgb(255,255,0);');
    el.setAttribute('hover-start-time', 2000);
    document.body.appendChild(el);

    expect(getComputedStyle(el).backgroundColor).to.equal('rgb(0, 0, 0)');

    setTimeout(() => {
      const touchStartEvt = new Event('touchstart');
      el.dispatchEvent(touchStartEvt);

      setTimeout(() => {
        const touchEndEvt = new Event('touchend');
        el.dispatchEvent(touchEndEvt);
        setTimeout(() => {
          expect(getComputedStyle(el).backgroundColor).to.equal('rgb(0, 0, 0)');
          done();
        }, 400);
      }, 2000);
    }, 1500);
  });
});
