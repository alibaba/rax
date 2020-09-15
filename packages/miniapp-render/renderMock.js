import { createWindow } from './src/window';
import createDocument from './src/document';
import cache from './src/utils/cache';

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

function generateDOM(document) {
  const root = document.body;

  const aa = document.createElement('div');
  aa.setAttribute('class', 'aa');

  const bb = document.createElement('div');
  bb.id = 'bb';
  bb.setAttribute('class', 'bb');

  const header = document.createElement('header');

  const footer = document.createElement('footer');

  const bb1 = document.createElement('div');
  bb1.setAttribute('class', 'bb1');
  bb1.textContent = '123';

  const bb2 = document.createElement('div');
  bb2.setAttribute('class', 'bb2');
  bb2.setAttribute('data-a', '123');
  bb2.textContent = '321';

  const bb3 = document.createElement('div');
  bb3.setAttribute('class', 'bb3');
  bb2.textContent = 'middle';

  const bb4 = document.createElement('span');
  bb4.id = 'bb4';
  bb4.setAttribute('class', 'bb4');
  bb2.setAttribute('data-index', '1');
  bb2.textContent = '1';

  const bb42 = document.createElement('span');
  bb42.setAttribute('class', 'bb4');
  bb42.setAttribute('data-index', '2');
  bb42.textContent = '2';

  const bb43 = document.createElement('span');
  bb43.setAttribute('class', 'bb4');
  bb43.setAttribute('data-index', '3');
  bb43.textContent = '3';

  const tail = document.createElement('div');
  tail.textContent = 'tail';

  footer.appendChild(bb4);
  footer.appendChild(bb42);
  footer.appendChild(bb43);

  header.appendChild(bb1);
  header.appendChild(bb2);

  bb.appendChild(header);
  bb.appendChild(bb3);
  bb.appendChild(footer);
  bb.appendChild(tail);

  aa.appendChild(bb);

  root.appendChild(aa);
}

const html = `
<div class="aa">
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
  createPage() {
    const pageId = '/pages/home/index-1';
    const window = createWindow();
    const document = createDocument(pageId);
    generateDOM(document);
    // document.body.innerHTML = html;
    document._internal = {
      data: {
        pageId
      },
      setData: (data, callback) => {
        setTimeout(() => {
          callback();
        }, 0);
      },
      firstRenderCallback: () => {}
    };
    window.__pageId = pageId;
    cache.setWindow(window);
    cache.setConfig(config);

    return {
      window,
      document
    };
  },
  async sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
};
