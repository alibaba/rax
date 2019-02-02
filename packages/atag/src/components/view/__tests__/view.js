describe('view', () => {
  const pages = [];

  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/view/__tests__/view.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i++) {
      await pages[i].close();
    }
  });

  it('hover', async() => {
    const page = await createPage();
    const view = await page.$('#view');

    const viewBox = await view.boundingBox();
    await page.addScriptTag({
      content: `
        const view = document.querySelector('#view');
        view.hoverStyle = 'color: red';
      `,
    });
    const { x, y, width, height } = viewBox;
    await page.mouse.move(x + width / 2, y + height / 2);
    await page.mouse.down();
    await page.waitFor(400);

    expect(await page.$eval('#view', el => el.style.color)).toEqual('red');
    await page.mouse.up();
    await page.waitFor(400);
    expect(await page.$eval('#view', el => el.style.color)).toEqual('');
  });
});
