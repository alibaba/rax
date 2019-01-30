describe('textarea', () => {
  const pages = [];

  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/textarea/__tests__/textarea.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i++) {
      await pages[i].close();
    }
  });

  it('value', async() => {
    const page = await createPage();
    const textarea = await page.$('#textarea');
    await textarea.click();

    await page.keyboard.sendCharacter('hello world');
    expect(await page.$eval('#textarea', el => el.value)).toEqual('hello world');
  });

  it('placeholder', async() => {
    const page = await createPage();
    await page.addScriptTag({
      content: `
        const textarea = document.querySelector('#textarea');
        textarea.placeholder = 'hello world'; 
        textarea.placeholderStyle = 'color: red'; 
      `,
    });

    expect(await page.screenshot()).toMatchImageSnapshot({
      failureThreshold: '0.1',
      failureThresholdType: 'percent',
    });
  });

  it('disabled', async() => {
    const page = await createPage();
    await page.addScriptTag({
      content: `
        const textarea = document.querySelector('#textarea');
        textarea.disabled = true;
      `,
    });
    expect(await page.$eval('#textarea', el => el.$.textarea.disabled)).toEqual(true);
  });

  it('maxlength', async() => {
    // Default maxlength is 140.
    const text200 = 'x'.repeat(200);
    const page = await createPage();
    const textarea = await page.$('#textarea');
    await textarea.click();
    await page.keyboard.sendCharacter(text200);

    expect(await page.$eval('#textarea', el => el.value.length)).toEqual(140);
  });

  it('auto-height', async() => {
    const page = await createPage();
    await page.addScriptTag({
      content: `
        const textarea = document.querySelector('#textarea');
        textarea.maxlength = 500;
        textarea.autoHeight = true;
        textarea.value = 'x'.repeat(500);
      `,
    });

    // Auto calculate height
    expect(await page.evaluate(`
      document.querySelector('#textarea').getBoundingClientRect().height
    `)).toBeGreaterThan(200);
  });
});
