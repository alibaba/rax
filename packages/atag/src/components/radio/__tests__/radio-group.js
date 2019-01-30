describe('radio-group', () => {
  const pages = [];

  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/radio/__tests__/radio-group.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i++) {
      await pages[i].close();
    }
  });

  it('change event', async() => {
    const page = await createPage();

    const worldHandle = await page.$('#world');
    await worldHandle.click();

    expect(await page.evaluate('__radio_group_change_value__')).toEqual('world');
  });
});

