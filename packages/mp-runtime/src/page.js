import getApp from './getApp';
import { $on } from './eventHub';

const page = require('@core/page');

function has(key) {
  return this && this.hasOwnProperty(key);
}
function noop() { }

export default function registerPage(pageInfo, renderFn, initPage) {
  const pageName = pageInfo.page;
  const pagePath = pageInfo.path;

  page.register({ page: pagePath }, function(module, exports, require) {
    initPage(function Page(config) {
      const pageCtx = require('@core/context');
      pageCtx.path = pagePath;
      const Rax = require('@core/rax');
      const page = require('@core/page');
      const { createElement, Component } = Rax;

      module.exports = class MPPage extends Component {
        constructor(props, ctx) {
          super(props, ctx);

          this._cfg = config;
          this.app = getApp();
          this.forceUpdate = this.forceUpdate.bind(this);

          /**
           * 为了让全局对象的变化被感知和重渲染
           * 暂时没有做页面的判断, 需要重新考虑性能
           * 目前这里是内存泄漏点
           */
          $on('PageNavigate', this.forceUpdate);

          if (config.data) {
            // inherit app
            this.state = Object.assign({}, config.data);
          }

          // 面向开发者生命周期函数内的 `this`
          const context = {
            createElement,
            setData: (...args) => this.setData.apply(this, args),
            setState: noop,
            Rax
          };
          context.__proto__ = this;
          Object.keys(config).forEach(key => {
            if (typeof config[key] === 'function') {
              context[key] = config[key].bind(context);
            } else {
              context[key] = config[key];
            }
          });
          Object.defineProperty(context, 'data', {
            get: () => {
              return this.state;
            },
            set: (data) => {
              this.state = data;
            }
          });
          this.ctx = context;

          this.render = () => {
            return renderFn.call(context).call(context, context.data, config);
          };

          /**
           * page 生命周期
           * load
           * ready
           * show
           * hide
           * unload
           */
          if (has.call(config, 'onLoad')) {
            // query passed by event payload
            // macro loop for setData to load
            setTimeout(() => {
              config.onLoad.call(context, pageCtx.pageQuery || {});
            });
            if (has.call(config, 'onShow')) {
              this.componentWillMount = () => {
                config.onShow.call(context);
              };
            }
          }
          if (has.call(config, 'onShow')) {
            page.on('show', config.onShow.bind(context));
          }
          if (has.call(config, 'onReady')) {
            page.on('ready', config.onReady.bind(context));
          }
          if (has.call(config, 'onHide')) {
            page.on('hide', config.onHide.bind(context));
          }
          if (has.call(config, 'onUnload')) {
            page.on('unload', config.onUnload.bind(context));
          }
          // page scroll event
          if (has.call(config, 'onPageScroll')) {
            if (pageCtx.document) {
              pageCtx.document.body.addEventListener('scroll', config.onPageScroll.bind(context));
            }
          }
        }

        /**
         * setData
         */
        setData(data, callback) {
          return this.setState(data, callback);
        }

        forceUpdate() {
          return this.setData({});
        }
      };
    }, require);
  });
}
