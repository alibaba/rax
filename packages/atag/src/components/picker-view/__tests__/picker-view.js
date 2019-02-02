describe('picker-view', () => {
  const pages = [];
  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/picker-view/__tests__/picker-view.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i ++) {
      await pages[i].close();
    }
  });

  it('value', async() => {
    const page = await createPage();
    await page.addScriptTag({
      content: `
        const pickerView = document.querySelector('#pickerView');
        pickerView.value = [1, 1];
      `,
    });
    await page.waitFor(200);
    expect(await page.$eval('#pickerView a-picker-view-column:nth-child(1)', el => el.selectedIndex)).toEqual(1);
    expect(await page.$eval('#pickerView a-picker-view-column:nth-child(2)', el => el.selectedIndex)).toEqual(1);
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
