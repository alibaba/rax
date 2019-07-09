import {createElement} from 'rax';

function Document(props) {
  const {
    pageHtml,
    pageData,
    title,
    styles,
    scripts,
    driver
  } = props;

  const baseFontSizeResetScript = <script dangerouslySetInnerHTML={{__html: `
    var remUnit = document.documentElement.clientWidth / 750;
    document.documentElement.style.fontSize = remUnit * 100 + 'px';
  `}} />;

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=no" />
        <title>{title || 'WebApp'}</title>
        {styles.map((style) => <link href={style} rel="stylesheet" />)}
        {driver === 'universal' ? baseFontSizeResetScript : null}
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: pageHtml || '' }} />
        {scripts.map((script) => <script src={script} />)}
        {<script data-from="server" type="application/json" dangerouslySetInnerHTML={{__html: pageData}} />}
      </body>
    </html>
  );
}

export default Document;
