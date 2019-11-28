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
    return <script data-from="server" dangerouslySetInnerHTML={{__html: 'window.__INITIAL_DATA__=' + JSON.stringify(initialData)}} />;
  }

  return null;
}

function Styles() {
  const context = useContext(DocumentContext) || {};

  const { styles = [] } = context;

  return styles.map((src, index) => <link rel="stylesheet" href={src} key={`style_${index}`} />);
}

function Scripts() {
  const context = useContext(DocumentContext) || {};

  const { scripts = [] } = context;

  return scripts.map(
    (src, index) => <script src={src} key={`script_${index}`}>
      {/* self-closing script element will not work in HTML */}
    </script>
  );
}

function DangerouslyStyle(props) {
  return <style dangerouslySetInnerHTML={{__html: props.children}} />;
}

function DangerouslyScript(props) {
  return <script dangerouslySetInnerHTML={{__html: props.children}} />;
}

export {
  Document,
  Root,
  Data,
  Styles,
  Scripts,
  DangerouslyStyle,
  DangerouslyScript,
};
