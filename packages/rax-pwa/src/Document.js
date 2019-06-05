import {createElement} from 'rax';

function Document(props) {
  const {
    pageHtml,
    pageData,
    title,
    styles,
    scripts,
  } = props;

  const data = JSON.stringify(pageData);

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=no" />
        <title>{title || 'WebApp'}</title>
        {
          styles && styles.map((style) => <link herf={style} rel="stylesheet" />)
        }
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: pageHtml || '' }} />
        {
          scripts && scripts.map((script) => <script src={script} />)
        }
        {
          data && <script data-from="server" type="application/json" dangerouslySetInnerHTML={{__html: data}} />
        }
      </body>
    </html>
  );
}

export default Document;