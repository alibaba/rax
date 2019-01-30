describe('icon', () => {
  const pages = [];

  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/icon/__tests__/icon.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i++) {
      await pages[i].close();
    }
  });

  it('type', async() => {
    const page = await createPage();
    // Default value
    expect(await page.$eval('#icon', el => el.type)).toEqual('');

    await page.evaluate(`
      const icon = document.querySelector('#icon');
      icon.type = 'success';
    `);
    expect(await page.$eval('#icon svg use', el => el.href.baseVal)).toEqual('#icon-success');
  });

  it('color', async() => {
    const page = await createPage();
    // Default value
    expect(await page.$eval('#icon', el => el.color)).toEqual('currentColor');

    const COLOR = 'rgb(255, 80, 0)';
    await page.evaluate(`
      const icon = document.querySelector('#icon');
      icon.type = 'success';
      icon.color = '${COLOR}';
    `);
    expect(await page.$eval('#icon svg', el => el.style.fill)).toEqual(COLOR);
  });

  it('size', async() => {
    const page = await createPage();
    // Default value
    expect(await page.$eval('#icon', el => el.size)).toEqual(23);

    await page.evaluate(`
      const icon = document.querySelector('#icon');
      icon.size = 100;
    `);
    expect(await page.$eval('#icon svg', el => el.style.width)).toEqual('100px');
  });
});

