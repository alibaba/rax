const timeout = 10000;

describe('label', () => {
  const pages = [];
  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/label/__tests__/label.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i ++) {
      await pages[i].close();
    }
  });

  it('for', async() => {
    const page = await createPage();

    expect(await page.$eval('#checkbox', el => el.checked)).toEqual(false);

    const labelHandle = await page.$('#label');
    await labelHandle.click();
    expect(await page.$eval('#checkbox', el => el.checked)).toEqual(true);
  });
}, timeout);

