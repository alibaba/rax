import { createElement } from 'rax';

function Document(props) {
  const {
    styles = [], // style file
    scripts = [], // js file
    title, // set in app.json
    pageHtml, // for SSR, origin html
    pageData, // for SSR，origin data
    userAgent // for SSR，custom data
  } = props;

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=no" />
        <title>{title}</title>
        {
          styles.map((style) => <link herf={style} rel="stylesheet" />)
        }
        {/* custom script */}
        <script dangerouslySetInnerHTML={{__html: `
          window.test = 123;
        `}} />
      </head>
      <body>
        {/* root container */}
        <div id="root" dangerouslySetInnerHTML={{ __html: pageHtml || '' }} />
        {/* for SSR，custom data */}
        <div>Your user agent: {userAgent}</div>
        {
          scripts.map((script) => <script src={script} />)
        }
        {/* for SSR origin data */}
        <script data-from="server" type="application/json" dangerouslySetInnerHTML={{__html: pageData}} />
      </body>
    </html>
  );
}

// SSR custom data source
Document.getInitalProps = (req, res) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent };
};

export default Document;
