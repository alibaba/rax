export default function registerPage({ path }, renderFactory, pageFactory) {
  const page = require('@core/page');

  page.register({ page: path }, function(module, exports, require) {
    const page = require('@core/page');
    const Rax = require('@core/rax');
    // 存储页面实例相关变量的对象，每个页面有独立的 clientId 和 pageName 不能共享
    const pageContextInfo = require('@core/context');

    function createPage(config) {
      class Page extends Rax.Component {
        constructor(props, context) {
          super(props, context);

          if (config.data) {
            this.state = config.data;
          }

          // 面向开发者生命周期函数内的 `this`
          const pageContext = {
            setData: this.setState.bind(this),
          };

          Object.keys(config).forEach(key => {
            if (typeof config[key] === 'function') {
              pageContext[key] = config[key].bind(pageContext);
            } else {
              pageContext[key] = config[key];
            }
          });

          Object.defineProperty(pageContext, 'data', {
            get: () => {
              return this.state;
            },
            set: (data) => {
              this.state = data;
            }
          });

          // page 生命周期
          const { onLoad, onShow, onReady, onHide, onUnload, onPageScroll } = config;

          // 页面加载时触发, 一个页面只会调用一次，在 onLoad 的参数中获取打开当前页面路径中的参数。
          if (typeof onLoad === 'function') {
            onLoad.call(pageContext, pageContextInfo.pageQuery || {});
          }

          if (typeof onShow === 'function') {
            // 如果有注册 onShow 事件初始化时立即执行
            this.componentWillMount = () => {
              onShow.call(pageContext);
            };
            page.on('show', onShow.bind(pageContext));
          }

          if (typeof onReady === 'function') {
            page.on('ready', onReady.bind(pageContext));
          }

          if (typeof onHide === 'function') {
            page.on('hide', onHide.bind(pageContext));
          }

          if (typeof onUnload === 'function') {
            page.on('unload', onUnload.bind(pageContext));
          }

          if (typeof onPageScroll === 'function') {
            if (pageContextInfo.document) {
              pageContextInfo.document.body.addEventListener('scroll', onPageScroll.bind(pageContext));
            }
          }

          this.render = () => {
            const render = renderFactory();
            return render.call(pageContext, pageContext.data);
          };
        }
      }

      module.exports = Page;
    }

    pageFactory(createPage);
  });
}
