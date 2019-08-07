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
        <title><%= projectName %></title>
      </head>
      <body>
        {/* root container */}
        <div id="root" dangerouslySetInnerHTML={{ __html: initialHtml || '' }} />
        {/* initial data from server side */}
        <script data-from="server" dangerouslySetInnerHTML={{__html: 'window.__INITIAL_DATA__=' + initialData}} />
        <script src={`${publicPath}web/index.js`} />
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
        <title><%= projectName %></title>
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
