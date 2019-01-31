describe('button', () => {
  const pages = [];
  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/button/__tests__/button.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i ++) {
      await pages[i].close();
    }
  });

  it('size', async() => {
    const page = await createPage();
    // Default size: default
    expect(await page.$eval('#button', el => el.size)).toEqual('default');
    await page.addScriptTag({
      content: `
        const button = document.getElementById('button');
        button.size = 'mini';
      `,
    });
    // Size: mini
    expect(await page.$eval('#button', el => el.size)).toEqual('mini');
    const snapshot = await page.screenshot();
    expect(snapshot).toMatchImageSnapshot({
      failureThreshold: '0.1',
      failureThresholdType: 'percent',
    });
  });

  it('type', async() => {
    const page = await createPage();
    // Default type: default
    expect(await page.$eval('#button', el => el.type)).toEqual('default');

    // Type: primary
    await page.addScriptTag({
      content: `
        const button = document.getElementById('button');
        button.type = 'primary';
      `,
    });
    expect(await page.$eval('#button', el => el.type)).toEqual('primary');
    const snapshot = await page.screenshot();
    expect(snapshot).toMatchImageSnapshot({
      customSnapshotIdentifier: 'button-primary',
      failureThreshold: '0.1',
      failureThresholdType: 'percent',
    });

    // Type: warn
    await page.addScriptTag({
      content: "button.type = 'warn'",
    });
    expect(await page.$eval('#button', el => el.type)).toEqual('warn');
    expect(await page.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'button-warn',
      failureThreshold: '0.1',
      failureThresholdType: 'percent',
    });
  });

  it('plain', async() => {
    const page = await createPage();
    // Default plain: false
    expect(await page.$eval('#button', el => el.plain)).toEqual(false);
    await page.addScriptTag({
      content: `
        const button = document.getElementById('button');
        button.plain = true;
      `,
    });
    expect(await page.$eval('#button', el => el.plain)).toEqual(true);
    expect(await page.evaluate(`
      getComputedStyle(document.getElementById('button')).backgroundColor
    `)).toEqual('rgba(0, 0, 0, 0)');
  });

  it('loading', async() => {
    const page = await createPage();
    // Default loading: false
    expect(await page.$eval('#button', el => el.loading)).toEqual(false);
    await page.addScriptTag({
      content: `
        const button = document.getElementById('button');
        button.loading = true;
      `,
    });
    expect(await page.$eval('#button', el => el.loading)).toEqual(true);
    expect(await page.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'button-loading',
      failureThreshold: '1', // loading circle may case differences in pixel.
      failureThresholdType: 'percent',
    });
  });

  it('disabled', async() => {
    const page = await createPage();
    expect(await page.$eval('#button', el => el.disabled)).toEqual(false);
    await page.addScriptTag({
      content: `
        const button = document.getElementById('button');
        button.disabled = true;
      `,
    });
    expect(await page.$eval('#button', el => el.disabled)).toEqual(true);
    const snapshot = await page.screenshot();
    expect(snapshot).toMatchImageSnapshot({
      failureThreshold: '0.1',
      failureThresholdType: 'percent',
    });
  });

  it('form-type', async() => {
    const page = await createPage();
    await page.addScriptTag({
      content: `
        const button = document.getElementById('button');
        button.formType = 'submit';
        button.addEventListener('_buttonSubmit', (evt) => {
          window.__submit_fired__ = true;
        });
      `,
    });
    const button = await page.$('#button');
    await button.click();
    expect(await page.evaluate('window.__submit_fired__')).toEqual(true);
  });
});
