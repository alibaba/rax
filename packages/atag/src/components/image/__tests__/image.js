describe('input', () => {
  const pages = [];
  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/image/__tests__/image.html');
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
    const image = await page.$('#image');
    const { width, height } = await image.boundingBox();
    expect(width).toEqual(300);
    expect(height).toEqual(225);
  });

  const IMAGE_URL = 'https://gw.alicdn.com/tfs/TB1VBforHSYBuNjSspfXXcZCpXa-510-370.png';
  it('src from empty to url', async() => {
    const page = await createPage();
    await page.addScriptTag({ content: `
      emptyImage.onload = function() {
        window.__image_loaded__ = true;
      };
      emptyImage.src = '${IMAGE_URL}';
    ` });
    await page.waitFor(500);
    expect(await page.evaluate('window.__image_loaded__'))
      .toEqual(true);
  });

  it('src from one to another', async() => {
    const page = await createPage();
    await page.addScriptTag({
      content: `
          image.onload = function() {
            window.__image_loaded__ = true;
          };
          image.src = '${IMAGE_URL}';
        `,
    });
    await page.waitFor(500);
    expect(await page.evaluate('window.__image_loaded__'))
      .toEqual(true);
  });

  it('mode', async() => {
    jest.setTimeout(50000);
    const modes = [
      'scaleToFill',
      'aspectFit',
      'aspectFill',
      'widthFix',
      'top',
      'bottom',
      'center',
      'left',
      'right',
      'top',
      'top',
      'bottom',
      'bottom',
    ];

    for (let i = 0, l = modes.length; i < l; i++ ) {
      const mode = modes[i];
      const page = await createPage();
      await page.addScriptTag({ content: `image.mode = '${mode}'` });
      const snapshot = await page.screenshot();
      expect(snapshot).toMatchImageSnapshot({
        customSnapshotIdentifier: 'image-mode-' + mode,
        failureThreshold: '0.1',
        failureThresholdType: 'percent',
      });
    }
  });
}
);
