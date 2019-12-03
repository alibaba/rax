import { createElement, createContext, useContext } from 'rax';

const DocumentContext = createContext({});

function Document(props) {
  return (
    <DocumentContext.Provider value={props}>
      {this.props.children}
    </DocumentContext.Provider>
  );
}

function Root() {
  const context = useContext(DocumentContext) || {};

  const { initialHtml } = context;

  if (initialHtml) {
    return <div id="root" dangerouslySetInnerHTML={{ __html: initialHtml || '' }} />;
  }

  return <div id="root" />;
}

function Data() {
  const context = useContext(DocumentContext) || {};

  const { initialData } = context;

  if (initialData) {
    return <script data-from="server" dangerouslySetInnerHTML={{__html: 'window.__INITIAL_DATA__=' + initialData}} />;
  }

  return null;
}

function Styles() {
  const context = useContext(DocumentContext) || {};

  const { publicPath, styles = [] } = context;

  return styles.map((src, index) => <link rel="stylesheet" href={`${publicPath}${src}`} key={`style_${index}`} />);
}

function Scripts() {
  const context = useContext(DocumentContext) || {};

  const { publicPath, scripts = [] } = context;

  return scripts.map(
    (src, index) => <script src={`${publicPath}${src}`} key={`script_${index}`}>
      {/* self-closing script element will not work in HTML */}
    </script>
  );
}

export {
  Document,
  Root,
  Data,
  Styles,
  Scripts,
};
