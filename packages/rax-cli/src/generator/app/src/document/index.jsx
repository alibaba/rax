import { createElement } from 'rax';

function Document(props) {
  <%_ if (projectFeatures.includes('ssr')) { -%>
  const {
    publicPath,
    initialHtml,
    initialData,
  } = props;

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=no" />
        <title>WebApp</title>
        <link href={`${publicPath}web/index.css`} rel="stylesheet" />
      </head>
      <body>
        {/* root container */}
        <div id="root" dangerouslySetInnerHTML={{ __html: initialHtml || '' }} />
        <script src={`${publicPath}web/index.js`} />
        {/* initial data from server side */}
        <script data-from="server" type="application/json" dangerouslySetInnerHTML={{__html: initialData}} />
      </body>
    </html>
  );
  <%_ } else { -%>
  const {
    publicPath
  } = props;

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=no" />
        <title>WebApp</title>
        <link href={`${publicPath}web/index.css`} rel="stylesheet" />
      </head>
      <body>
        {/* root container */}
        <div id="root" />
        <script src={`${publicPath}web/index.js`} />
      </body>
    </html>
  );
  <%_ } -%>
}

export default Document;
