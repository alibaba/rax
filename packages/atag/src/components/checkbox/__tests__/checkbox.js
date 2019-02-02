describe('checkbox', () => {
  const pages = [];

  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/checkbox/__tests__/checkbox.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i++) {
      await pages[i].close();
    }
  });

  it('checked', async() => {
    const page = await createPage();
    expect(await page.$eval('#checkbox', el => el.checked)).toEqual(false);

    const checkbox = await page.$('#checkbox');
    await checkbox.click();
    expect(await page.$eval('#checkbox', el => el.checked)).toEqual(true);
    expect(await page.screenshot()).toMatchImageSnapshot({
      failureThreshold: '0.1',
      failureThresholdType: 'percent',
    });
  });
});

