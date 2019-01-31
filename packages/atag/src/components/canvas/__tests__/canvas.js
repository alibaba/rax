describe('canvas', () => {
  const pages = [];

  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/canvas/__tests__/canvas.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i++) {
      await pages[i].close();
    }
  });

  it('default size', async() => {
    const page = await createPage();
    // Default width/height is 300/225
    expect(await page.$eval('#canvas', el => el.width)).toEqual('300');
    expect(await page.$eval('#canvas', el => el.height)).toEqual('225');
  });

  it('getContext', async() => {
    const page = await createPage();
    // Default width/height is 300/225\
    const context2d = await page.evaluate(`
      document.getElementById('canvas').getContext()
    `);
    expect(context2d).not.toBeNull();
  });
});
