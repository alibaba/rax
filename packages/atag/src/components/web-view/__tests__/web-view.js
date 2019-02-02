describe('web-view', () => {
  const pages = [];

  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/web-view/__tests__/web-view.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i++) {
      await pages[i].close();
    }
  });

  it('src', async() => {
    const page = await createPage();
    await page.evaluate(`
      const wv = document.querySelector('#web-view');
      wv.src = 'http://localhost:9002/components/web-view/__tests__/frame.html';
    `);
    await page.waitFor(500);
    expect(await page.screenshot()).toMatchImageSnapshot({
      failureThreshold: '0.1',
      failureThresholdType: 'percent',
    });
  });
});
