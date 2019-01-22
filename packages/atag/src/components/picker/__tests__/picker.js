const timeout = 10000;

describe('picker', () => {
  const pages = [];
  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/picker/__tests__/picker.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i ++) {
      await pages[i].close();
    }
  });

  it('should active picker and select a value', async() => {
    const page = await createPage();
    const pickerCallOut = await page.$('#callOutPicker');
    await pickerCallOut.click();

    const picker = await page.$('#picker');

    expect(
      await page.evaluate(picker => picker.$.container.style.display, picker)
    ).toEqual('block');
    expect(
      await page.evaluate(picker => picker.$.mask.style.display, picker)
    ).toEqual('block');

    // Snapshot of picker is shown.
    const snapshot = await page.screenshot();
    expect(snapshot).toMatchImageSnapshot({
      failureThreshold: '0.1',
      failureThresholdType: 'percent',
    });

    const confirmButton = await page.evaluateHandle(picker => picker.$.confirm, picker);
    await confirmButton.click();
    // Close the picker panel.
    expect(
      await page.evaluate(picker => picker.$.container.style.display, picker)
    ).toEqual('none');
    expect(
      await page.evaluate(picker => picker.$.mask.style.display, picker)
    ).toEqual('none');

    expect(
      await picker.$eval('#callOutPicker', el => el.innerText)
    ).toEqual('0'); // Default select value 0.
  });

  it('should not work if disabled', async() => {
    const page = await createPage();
    // Try to active disable picker.
    await page.click('#callOutDisabledPicker');

    const picker = await page.$('#disabledPicker');
    // Keep inactive.
    expect(
      await page.evaluate(picker => picker.$.container.style.display, picker)
    ).toEqual('none');
    expect(
      await page.evaluate(picker => picker.$.mask.style.display, picker)
    ).toEqual('none');
  });
},
timeout
);
