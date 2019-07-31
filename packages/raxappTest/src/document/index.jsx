import { createElement } from 'rax';

function Document(props) {
  const {
    styles = [], // 页面所依赖的 css 资源
    scripts = [], // 页面所依赖的 js 资源
    title, // 从 app.json 中读取
    pageHtml, // SSR 特有，页面初始 html
    pageData, // SSR 特有，页面初始数据
    userAgent // SSR 特有，用户自定义数据
  } = props;

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=no" />
        <title>{title}</title>
        {/* 页面所依赖的 css 资源 */}
        {
          styles.map((style) => <link herf={style} rel="stylesheet" />)
        }
        {/* 自定义的脚本 */}
        <script dangerouslySetInnerHTML={{__html: `
          window.__core__ = {
            useAppEffect: function() {},
            usePageEffect: function() {},
            useRouter: function(routerConfig) {
              return {
                Router: routerConfig.routes[0].component,
              }
            }

          };
        `}} />
      </head>
      <body>
        {/* 页面容器节点 */}
        <div id="root" dangerouslySetInnerHTML={{ __html: pageHtml || '' }} />
        {/* SSR 特有，用户自定义数据 */}
        <div>Your user agent: {userAgent}</div>
        {/* 页面所依赖的 js 资源 */}
        {
          scripts.map((script) => <script src={script} />)
        }
        {/* SSR 特有，页面初始数据 */}
        <script data-from="server" type="application/json" dangerouslySetInnerHTML={{__html: pageData}} />
      </body>
    </html>
  );
}

// SSR 场景下自定义数据源
Document.getInitalProps = (req, res) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent };
};

export default Document;