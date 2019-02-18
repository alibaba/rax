describe('form', () => {
  const pages = [];

  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/form/__tests__/form.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i++) {
      await pages[i].close();
    }
  });

  it('submit', async() => {
    const page = await createPage();
    await page.click('#radioTarget');
    await page.click('#checkboxTarget');
    await page.click('#input');
    await page.keyboard.sendCharacter('hello world');
    await page.click('#submit');
    const submitEventDetail = await page.evaluate('window.__submit_event_detail__');
    expect(submitEventDetail).toMatchSnapshot();
  });

  it('reset', async() => {
    const page = await createPage();
    await page.click('#radioTarget');
    await page.click('#checkboxTarget');
    await page.click('#input');
    await page.keyboard.sendCharacter('hello world');
    await page.click('#reset');

    expect(await page.evaluate('__reset_event__')).toEqual(true);

    await page.click('#submit');
    const submitEventDetail = await page.evaluate('window.__submit_event_detail__');
    expect(submitEventDetail).toMatchSnapshot();
  });
});

