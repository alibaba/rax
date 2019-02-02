describe('progress', () => {
  const pages = [];
  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/progress/__tests__/progress.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i ++) {
      await pages[i].close();
    }
  });

  it('percent', async() => {
    const page = await createPage();
    await page.addScriptTag({
      content: `
        const progress = document.querySelector('#progress');
        progress.percent = 90;
      `,
    });

    expect(await page.$eval('#progress', el => el.$.active.style.width)).toEqual('90%');
  });

  it('backgroundColor', async() => {
    const page = await createPage();
    await page.addScriptTag({
      content: `
        const progress = document.querySelector('#progress');
        progress.backgroundColor = 'red';
      `,
    });

    expect(await page.$eval('#progress', el => el.$.container.style.backgroundColor)).toEqual('red');
  });

  it('activeColor', async() => {
    const page = await createPage();
    await page.addScriptTag({
      content: `
        const progress = document.querySelector('#progress');
        progress.activeColor = 'red';
      `,
    });

    expect(await page.$eval('#progress', el => el.$.active.style.backgroundColor)).toEqual('red');
  });

  it('strokeWidth', async() => {
    const page = await createPage();
    await page.addScriptTag({
      content: `
        const progress = document.querySelector('#progress');
        progress.strokeWidth = 99;
      `,
    });

    const height = await page.$eval('#progress', el => el.$.active.style.height);
    expect(height).toEqual('99px');
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
