describe('animation', () => {
  const pages = [];

  async function createPage() {
    const page = await global.__BROWSER__.newPage();
    await page.setViewport(global.__VIEWPORT__);
    await page.goto('http://localhost:9002/components/animation/__tests__/animation.html');
    pages.push(page);
    return page;
  }

  afterAll(async() => {
    for (let i = 0, l = pages.length; i < l; i++) {
      await pages[i].close();
    }
  });

  it('default props', async() => {
    const page = await createPage();

    expect(await page.$eval('#animation', el => el.eventType)).toEqual('timing');
    expect(await page.$eval('#animation', el => el.scope)).toEqual('frame');
    expect(await page.$eval('#animation', el => el.styleProp)).toEqual('animation-style');
    expect(await page.$eval('#animation', el => el.finished)).toEqual(false);
  });

  it('default timeline data', async() => {
    const page = await createPage();

    expect(await page.$eval('#animation', el => el.timeline.data.length)).toEqual(3);
    expect(await page.$eval('#animation', el => el.timeline.totalDuration)).toEqual(1);
    expect(await page.$eval('#animation', el => el.timeline.isPlaying)).toEqual(true);
    expect(await page.$eval('#animation', el => el.timeline.isPause)).toEqual(false);
    expect(await page.$eval('#animation', el => el.timeline.iterations)).toEqual(1);
    expect(await page.$eval('#animation', el => Math.round(el.timeline.currentValue.opacity))).toEqual(0);
    expect(await page.$eval('#animation', el => el.timeline.data[0].keyframes.length)).toEqual(3);
    expect(await page.$eval('#animation', el => el.timeline.properties.length)).toEqual(3);
    expect(await page.$eval('#animation', el => el.timeline.properties[0].name)).toEqual('opacity');
    expect(await page.$eval('#animation', el => el.timeline.properties[0].keyframe.easing)).toEqual('linear');
    expect(await page.$eval('#animation', el => el.timeline.properties[0].keyframe.keyframeList.length)).toEqual(3);
  });

  it('animation timeline', async(done) => {
    const page = await createPage();

    setTimeout(async() => {
      expect(await page.$eval('#animation', el => Math.round(el.timeline.currentValue.opacity * 10) / 10)).toEqual(0.1);
      expect(await page.$eval('#animation', el => el.timeline.currentValue.list.map(num => {
        return Math.round(num * 10) / 10;
      }))).toEqual([0.2, 0.4, 0.8]);
    }, 200);

    setTimeout(async() => {
      expect(await page.$eval('#animation', el => Math.round(el.timeline.currentValue.opacity * 10) / 10)).toEqual(0.4);
      expect(await page.$eval('#animation', el => el.timeline.currentValue.list.map(num => {
        return Math.round(num * 10) / 10;
      }))).toEqual([0.6, 1.2, 2.4]);
    }, 600);

    setTimeout(async() => {
      expect(await page.$eval('#animation', el => Math.round(el.timeline.currentValue.opacity * 10) / 10)).toEqual(1);
      expect(await page.$eval('#animation', el => el.timeline.currentValue.list.map(num => {
        return Math.round(num * 10) / 10;
      }))).toEqual([1, 2, 4]);
      expect(await page.$eval('#animation', el => el.timeline.currentValue.color)).toEqual('green');
      done();
    }, 1200);
  });

  it('default animation pan props', async() => {
    const page = await createPage();

    expect(await page.$eval('#animation-pan', el => el.eventType)).toEqual('pan');
  });

  it('default animation button props', async() => {
    const page = await createPage();

    expect(await page.$eval('#animation-button', el => el.eventOrigin)).toEqual('button');
    expect(await page.$eval('#animation-button', el => el.eventType)).toEqual('click');
    expect(await page.$eval('#animation-button', el => el.timeline.iterations)).toEqual(2);
    expect(await page.$eval('#animation-button', el => el.timeline.totalDuration)).toEqual(5);
    expect(await page.$eval('#animation-button', el => el.timeline.easing)).toEqual('ease-in');
  });

  it('animation button click', async(done) => {
    const page = await createPage();
    const button = await page.$('#button');
    const buttonBox = await page.$('#animation-button-box');
    const buttonText = await page.$('#animation-button-text');
    const rect = await button.boundingBox();

    await page.mouse.click(rect.x + rect.width / 2, rect.y + rect.height / 2);
    setTimeout(async() => {
      expect(await page.$eval('#animation-button', el => el.timeline.currentValue.bgColor)).toEqual('rgba(254, 255, 1, 1)');
      expect(await page.$eval('#animation-button', el => Math.round(el.timeline.currentValue.width * 10) / 10)).toEqual(0.3);
      expect(await page.$eval('#animation-button', el => Math.round(el.timeline.currentValue.opacity * 1000) / 1000)).toEqual(0.003);
      done();
    }, 210);
  });
});
