const timeout = 10000;

describe('scroll-view', () => {
  const pages = [];
  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/scroll-view/__tests__/scroll-view.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i ++) {
      await pages[i].close();
    }
  });

  it('prevent property', async() => {
    const page = await createPage();
    await page.addScriptTag({
      content: `
          const scrollView = document.getElementById('scrollView');
          scrollView.scrollX = true;
          scrollView.scrollY = false;
          scrollView._prevent = true;
        `,
    });
    const scrollViewHandle = await page.$('#scrollView');
    const overflowX = await page.evaluate(el => el.style.overflowX, scrollViewHandle);
    const overflowY = await page.evaluate(el => el.style.overflowY, scrollViewHandle);
    const scrollX = await page.evaluate(el => el.scrollX, scrollViewHandle);
    const scrollY = await page.evaluate(el => el.scrollY, scrollViewHandle);
    // overflowX/Y are overrided.
    expect(overflowX).toEqual('hidden');
    expect(overflowY).toEqual('hidden');
    // scrollX and scrollY property dones't changed.
    expect(scrollX).toEqual(true);
    expect(scrollY).toEqual(false);
  });
},
timeout
);
