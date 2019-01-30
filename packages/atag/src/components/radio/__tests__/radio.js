describe('radio', () => {
  const pages = [];

  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/radio/__tests__/radio.html');
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
    expect(await page.$eval('#radio', el => el.checked)).toEqual(false);

    const radio = await page.$('#radio');
    await radio.click();
    expect(await page.$eval('#radio', el => el.checked)).toEqual(true);
    expect(await page.screenshot()).toMatchImageSnapshot({
      failureThreshold: '0.1',
      failureThresholdType: 'percent',
    });
  });

  it('disabled', async() => {
    const page = await createPage();
    await page.evaluate('document.querySelector("#radio").disabled = true');
    const radio = await page.$('#radio');
    await radio.click();
    expect(await page.$eval('#radio', el => el.checked)).toEqual(false);
  });

  it('color', async() => {
    const page = await createPage();
    await page.evaluate('document.querySelector("#radio").color = "#00ff00"');
    const radio = await page.$('#radio');
    await radio.click();
    expect(await page.evaluate(`
      const radio = document.querySelector("#radio");
      const dot = radio.shadowRoot.querySelector(".dot");
      dot.style.backgroundColor;
    `)).toEqual('rgb(0, 255, 0)');
  });
});

