const timeout = 10e3; // 10s
/**
 * Fix text to replace both '\n' and '\\n' to <br />
 */
describe('Text fixture break warp.', () => {
  let page;
  beforeAll(async() => {
    page = await global.__BROWSER__.newPage();
    await page.goto('http://localhost:9002/components/text/__tests__/index.html');
  }, timeout);

  it('should replace \\n to br tag', async() => {
    let text = await page.evaluate(() => {
      const node = document.querySelector('.break-wrap-with-text-break');
      return node.innerHTML;
    });
    expect(text).toEqual('This is a paragraph with <br> break lines.');
  });

  it('should replace LF to br tag', async() => {
    let text = await page.evaluate(() => {
      const node = document.querySelector('.break-wrap-with-lf');
      return node.innerHTML;
    });
    expect(text).toEqual('This is a paragraph with <br> break lines.');
  });
});
