describe('switch', () => {
  const pages = [];

  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/switch/__tests__/switch.html');
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

    // Default checked is false.
    expect(await page.$eval('#switch', el => el.checked)).toEqual(false);

    // Click switch to toggle state.
    const switchHandle = await page.$('#switch');
    await switchHandle.click();

    // Checked should be true.
    expect(await page.$eval('#switch', el => el.checked)).toEqual(true);
    expect(await page.screenshot()).toMatchImageSnapshot({
      failureThreshold: '0.1',
      failureThresholdType: 'percent',
    });
  });

  it('color', async() => {
    const page = await createPage();

    expect(await page.$eval('#switch', el => el.color)).toEqual('');
    await page.addScriptTag({
      content: `
        const sw = document.querySelector('#switch');
        sw.color = 'red';
        sw.checked = true;
      `,
    });

    const receivedColor = await page.evaluate(`
      document.querySelector('#switch').$.slider.style.backgroundColor
    `);
    expect(receivedColor).toEqual('red');
  });
});
