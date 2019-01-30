describe('text', () => {
  const pages = [];

  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/text/__tests__/text.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i++) {
      await pages[i].close();
    }
  });

  it('selectable', async() => {
    const getUserSelctableCommand = 'getComputedStyle(document.querySelector(\'#text\')).userSelect';

    const page = await createPage();
    expect(await page.$eval('#text', el => el.selectable)).toEqual(false);
    expect(await page.evaluate(getUserSelctableCommand)).toEqual('none');

    await page.evaluate(`
      text.innerText = 'HELLO WORLD';
      text.selectable = true;
    `);

    expect(await page.$eval('#text', el => el.selectable)).toEqual(true);
    expect(await page.evaluate(getUserSelctableCommand)).toEqual('all');
  });
});
