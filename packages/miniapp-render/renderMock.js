import render from './src';

const config = {
  optimization: {
    elementMultiplexing: true,
    textMultiplexing: true,
    commentMultiplexing: true,
    domExtendMultiplexing: true,
    styleValueReduce: 1000,
    attrValueReduce: 1000,
  }
};

const html = `<div class="aa">
    <div id="bb" class="bb">
        <header>
            <div class="bb1">123</div>
            <div class="bb2" data-a="123">321</div>
        </header>
        <div class="bb3">middle</div>
        <footer>
            <span id="bb4" class="bb4" data-index=1>1</span>
            <span class="bb4" data-index=2>2</span>
            <span class="bb4" data-index=3>3</span>
        </footer>
        <div>tail</div>
    </div>
</div>`;

global.wx = {
  redirectTo(options) {
    if (typeof global.expectCallMethod === 'string') expect(global.expectCallMethod).toBe('redirectTo');
    if (typeof global.expectPagePath === 'string') expect(options.url).toBe(global.expectPagePath);
  },
  navigateTo(options) {
    if (typeof global.expectCallMethod === 'string') expect(global.expectCallMethod).toBe('navigateTo');
    if (typeof global.expectPagePath === 'string') expect(options.url).toBe(global.expectPagePath);
  },
  getImageInfo(options) {
    setTimeout(() => {
      if (global.expectSuccess) {
        options.success({
          width: 100,
          height: 88,
        });
      } else {
        options.fail();
      }
    }, 10);
  },
  login() {}
};

global.CONTAINER = global.wx;

export default {
  html,
  createPage(type = 'home') {
    const pageId = `1-1-/pages/${type}/index`;
    const page = render.createPage(pageId, config);
    page.window.__pageId = pageId;
    page.document.body.innerHTML = html;

    return page;
  },
  async sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
};
