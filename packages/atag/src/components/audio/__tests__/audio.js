const timeout = 10000;

describe('audio', () => {
  let page;
  beforeAll(async() => {
    page = await global.__BROWSER__.newPage();
    await page.goto('http://localhost:9002/');
  }, timeout);

  afterAll(async() => {
    await page.close();
  });

  it('should load without error', async() => {
    let title = await page.evaluate(() => document.title);
    expect(title).toContain('Atag Demo');
  });
},
timeout
);
