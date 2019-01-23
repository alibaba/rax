const timeout = 10000;

describe('input', () => {
  const pages = [];
  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/input/__tests__/input.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i ++) {
      await pages[i].close();
    }
  });

  it('should render input and type some words', async() => {
    const page = await createPage();
    await page.click('#input');
    await page.keyboard.type('Hello World!');

    const text = await page.$eval('#input', el => el.value);
    expect(text).toEqual('Hello World!');
  });

  it('maxlength works', async() => {
    const textWith20Chars = 'qwertyuiopasdfghjkl';
    const page = await createPage();
    await page.click('#input');
    await page.keyboard.type(textWith20Chars);

    const text = await page.$eval('#input', el => el.value);
    expect(text).toEqual(textWith20Chars.slice(0, 14));
  });

  it('should emit custom input event', async() => {
    const page = await createPage();
    await page.addScriptTag({
      content: `
          let inputEventCount = 0;
          const input = document.querySelector('#input');
          input.addEventListener('input', (event) => {
            inputEventCount ++;
            window.inputValue = event.detail.value;
          });
        `,
    });
    await page.click('#input');
    await page.keyboard.type('Foo');
    expect(await page.evaluate('inputEventCount')).toEqual(3);
    expect(await page.evaluate('inputValue')).toEqual('Foo');
  });

  it('should be controled by set value', async() => {
    const page = await createPage();
    const text = 'HELLO WORLD!';
    await page.addScriptTag({
      content: `document.querySelector('#input').value = '${text}';`,
    });

    expect(await page.$eval('#input', el => el.value)).toEqual(text);
    expect(await page.screenshot()).toMatchImageSnapshot({
      failureThreshold: '0.1',
      failureThresholdType: 'percent',
    });
  });
},
timeout
);
