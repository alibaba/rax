describe('swiper', () => {
  const pages = [];
  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/swiper/__tests__/swiper.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i++ ) {
      await pages[i].close();
    }
  });

  it('current', async() => {
    const page = await createPage();
    expect(await page.$eval('#swiper', el => el.current)).toEqual(0);

    await page.addScriptTag({
      content: `
        const swiper = document.querySelector('#swiper');
        swiper.current = 2;
      `,
    });
    await page.waitFor(500);
    expect(await page.$eval('#swiper', el => el.current)).toEqual(2);
    expect(await page.screenshot()).toMatchImageSnapshot({
      failureThreshold: '0.1',
      failureThresholdType: 'percent',
    });
  });

  it('duration', async() => {
    const page = await createPage();
    expect(await page.$eval('#swiper', el => el.current)).toEqual(0);

    await page.addScriptTag({
      content: `
        const swiper = document.querySelector('#swiper');
        swiper.$.swiperItems.addEventListener('transitionend', (evt) => {
          window.__swiper_transition_duration__ = evt.elapsedTime;
        });
        swiper.duration = 100;
        swiper.current = 1;
      `,
    });

    await page.waitFor(200);
    expect(await page.$eval('#swiper', el => el.current)).toEqual(1);
    expect(await page.evaluate('window.__swiper_transition_duration__')).toEqual(0.1);
  });
});
