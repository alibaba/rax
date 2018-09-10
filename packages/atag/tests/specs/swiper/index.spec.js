describe('<a-swiper-item>', function() {
  this.timeout(5000);

  it('should render a-swiper', () => {
    const swiper = document.createElement('a-swiper');
    expect(swiper).to.not.be.an.instanceOf(HTMLUnknownElement);
  });

  it('should render a-swiper-item', () => {
    const swiperItem = document.createElement('a-swiper-item');
    expect(swiperItem).to.not.be.an.instanceOf(HTMLUnknownElement);
  });

  it('should swiper', () => {
    const swiper = document.createElement('a-swiper');
    swiper.innerHTML = `
      <a-swiper-item>1</a-swiper-item>
      <a-swiper-item>2</a-swiper-item>
      <a-swiper-item>3</a-swiper-item>
    `;
    expect(swiper).to.not.be.an.instanceOf(HTMLUnknownElement);
  });

  it('should autoplay', done => {
    const swiper = document.createElement('a-swiper');
    swiper.setAttribute('autoplay', true);
    swiper.setAttribute('circular', true);
    swiper.setAttribute('interval', 2000);
    swiper.style.width = '500px';
    swiper.innerHTML = `
      <a-swiper-item id="swiper-item">1</a-swiper-item>
      <a-swiper-item>2</a-swiper-item>
      <a-swiper-item>3</a-swiper-item>
  `;
    document.body.appendChild(swiper);

    const swiperWrapper = swiper.shadowRoot.querySelector('#swiperWrap');
    const swiperItem = swiper.querySelector('#swiper-item');

    setTimeout(() => {
      const swiperItemWidth = getComputedStyle(swiperItem).width;
      const transform = swiperWrapper.style.transform;
      expect(transform).to.be.equal(
        `translate3d(-${swiperItemWidth}, 0px, 0px)`
      );
      done();
    }, 1000);
  });
});
