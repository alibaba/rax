function setTimeoutAsync(func, time = 50) {
  return new Promise(resolve => {
    setTimeout(() => {
      func();
      resolve();
    }, time);
  });
}

describe('<a-scroll-view>', function() {
  this.timeout(8000);

  const el = document.createElement('a-scroll-view');
  it('render an a-scroll-view', done => {
    expect(el).to.not.be.an.instanceOf(HTMLUnknownElement);

    done();
  });

  it('scroll horizontal and vertial, without and with animation', done => {
    // const el = document.createElement('a-scroll-view');
    el.style = 'width: 300px; height: 200px;';
    el.setAttribute('scroll-y', true);
    // el.setAttribute('scroll-top', '200');
    el.setAttribute('scroll-into-view', 'yellow');

    let yellowEl = null;
    for (const id of ['red', 'blue', 'yellow', 'green']) {
      const childEl = document.createElement('a-view');
      childEl.id = id;
      childEl.style = `width: 500px; height: 100px; background-color: ${id};`;
      el.appendChild(childEl);
      if (id === 'yellow') {
        yellowEl = childEl;
      }
    }

    document.body.appendChild(el);

    setTimeout(() => {
      expect(getComputedStyle(el).height).to.equal('200px');
      expect(el.scrollTop).to.equal(yellowEl.offsetTop);

      el.setAttribute('scroll-top', '0');
      expect(el.scrollTop).to.equal(0);

      el.setAttribute('scroll-with-animation', true);
      el.setAttribute('scroll-top', '200');

      new Promise(resolve => {
        setTimeout(() => {
          // In the middle of the animation, the animation is actually executing
          expect(el.scrollTop).to.above(0).and.below(200);
          resolve();
        }, 100);
      })
      .then(() => {
        el.setAttribute('scroll-x', true);
        el.setAttribute('scroll-left', '100');
        return new Promise(resolve => setTimeout(() => {
          expect(el.scrollLeft).to.above(0).and.below(100);
          resolve();
        }, 200));
      })
      .then(() => {
        done();
      });
    }, 500);
  });

  it('emit events (scroll, scroll-to-upper, scroll-to-lower)', done => {
    // reset state
    // el.setAttribute('upper-threshold', 100);
    // el.setAttribute('lower-threshold', 100);

    setTimeout(() => {
      el.setAttribute('scroll-with-animation', false);
      el.setAttribute('scroll-top', '0');
      el.setAttribute('scroll-left', '0');
      let scrollTimes = 0;
      let scrollLowerXTimes = 0;
      let scrollUpperXTimes = 0;
      let scrollUpperYTimes = 0;
      let scrollLowerYTimes = 0;

      el.addEventListener('scroll', () => scrollTimes++);
      el.addEventListener('scrolltolower', () => scrollLowerXTimes++);
      el.addEventListener('scrolltoupper', () => scrollUpperXTimes++);

      setTimeoutAsync(() => {
        el.setAttribute('scroll-with-animation', true);
      })

      // Horizontal scrolling
      .then(() => {
        return setTimeoutAsync(() => el.setAttribute('scroll-left', 200), 600);
      })
      .then(() => {
        return setTimeoutAsync(() => el.setAttribute('scroll-left', 0), 600);
      })
      .then(() => {
        return setTimeoutAsync(() => {
          expect(scrollTimes).to.above(0);
          expect(scrollLowerXTimes).to.above(1);
          expect(scrollUpperXTimes).to.above(1);
        }, 1200);
      })

      // Vertical scrolling
      .then(() => {
        el.addEventListener('scrolltolower', () => scrollLowerYTimes++);
        el.addEventListener('scrolltoupper', () => scrollUpperYTimes++);
      })
      .then(() => {
        return setTimeoutAsync(() => el.setAttribute('scroll-top', 200), 600);
      })
      .then(() => {
        return setTimeoutAsync(() => el.setAttribute('scroll-top', 0), 600);
      })
      .then(() => {
        return setTimeoutAsync(() => {
          expect(scrollLowerYTimes).to.above(1);
          expect(scrollUpperYTimes).to.above(1);
        }, 1200);
      })

      .catch(e => {
        throw e;
      })
      .then(() => {
        done();
      });

    }, 500);
  });
});
