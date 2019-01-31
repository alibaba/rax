describe('navigator', () => {
  const pages = [];
  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/navigator/__tests__/navigator.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i ++) {
      await pages[i].close();
    }
  });

  it('url', async() => {
    const page = await createPage();
    const url = 'foo';
    await page.addScriptTag({
      content: `
        const navigator = document.querySelector('#navigator');
        navigator.url = '${url}';
      `,
    });
    await page.click('#navigator');
    expect(await page.evaluate('__renderer_to_worker_message__')).toMatchSnapshot();
  });

  it('open-type', async() => {
    const page = await createPage();
    const url = 'foo';
    await page.addScriptTag({
      content: `
        const navigator = document.querySelector('#navigator');
        navigator.url = '${url}';
        navigator.openType = 'redirect';
      `,
    });
    await page.click('#navigator');
    expect(await page.evaluate('__renderer_to_worker_message__')).toMatchSnapshot();
  });
});
