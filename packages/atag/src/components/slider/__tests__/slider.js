describe('slider', () => {
  const pages = [];
  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/slider/__tests__/slider.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i ++) {
      await pages[i].close();
    }
  });

  it('min and max', async() => {
    const page = await createPage();
    await page.addScriptTag({
      content: `
        const slider = document.getElementById('slider');
        slider.value = 40;
        slider.min = 20;
        slider.max = 60;
      `,
    });

    // Expect center of slider.
    const sliderPosition = await page.$eval('#slider', el => el.$.active.style.width);
    expect(sliderPosition).toEqual('50%');
  });

  it('image snapshot', async() => {
    const page = await createPage();
    const snapshot = await page.screenshot();
    expect(snapshot).toMatchImageSnapshot({
      failureThreshold: '0.1',
      failureThresholdType: 'percent',
    });
  });
});
