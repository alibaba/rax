import { createElement } from 'rax';

function Root(props, context) {
  const { __initialHtml } = context;

  if (__initialHtml) {
    return <div id="root" dangerouslySetInnerHTML={{ __html: __initialHtml || '' }} />;
  }

  return <div id="root" />;
}

function Data(props, context) {
  const { __initialData } = context;

  if (__initialData) {
    return <script data-from="server" dangerouslySetInnerHTML={{__html: 'window.__INITIAL_DATA__=' + __initialData}} />;
  }

  return null;
}

// Named by role rather than implementationm, so component name are `Style` rather than `Styles`.
function Style(props, context) {
  const { __styles = [] } = context;

  return __styles.map((src, index) => <link rel="stylesheet" href={src} key={`style_${index}`} />);
}

function Script(props, context) {
  const { __scripts = [] } = context;

  return __scripts.map(
    (src, index) => <script src={src} key={`script_${index}`}>
      {/* self-closing script element will not work in HTML */}
    </script>
  );
}

export {
  Root,
  Data,
  Style,
  Script,
};
