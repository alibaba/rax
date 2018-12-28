const timeout = 10000;

describe('audio', () => {
  let page;
  beforeAll(async() => {
    page = await global.__BROWSER__.newPage();
    await page.goto('http://localhost:9002/components/audio/__tests__/index.html');
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
