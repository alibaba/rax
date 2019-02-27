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
      const animationFirstChild = await page.$('#animation-first-child');
      const text = await page.evaluate(node => node.innerHTML, animationFirstChild);
      expect(await page.$eval('#animation-first-child', el => el)).toEqual(null);
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
});
