import { createElement } from 'rax';

function Root(props, context) {
  const { __initialHtml } = context;

  // comment node for ssr parse root node position
  if (process.env.__IS_SERVER__) {
    return [
      { __html: '<!--__BEFORE_ROOT__-->' },
      <div id="root" key="root" dangerouslySetInnerHTML={{ __html: __initialHtml || '' }} />,
      { __html: '<!--__AFTER_ROOT__-->' }
    ];
  }
  return <div id="root" key="root" dangerouslySetInnerHTML={{ __html: __initialHtml || '' }} />;
}

function Manifest(props, context) {
  const { __manifests, __pagePath } = context;

  if (Array.isArray(__manifests)) {
    const manifest = __manifests.find((item) => {
      return item.path === __pagePath;
    });

    // manifest json type: https://developer.mozilla.org/en-US/docs/Web/Manifest#Deploying_a_manifest_with_the_link_tag
    if (manifest && manifest.data) {
      return (
        <script type="application/manifest+json" dangerouslySetInnerHTML={{__html: JSON.stringify(manifest.data)}} />
      );
    }
  }

  return null;
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
  const consumer = getConsumer(props);

  if (typeof consumer === 'function') {
    return consumer(__styles);
  }

  return __styles.map((src, index) => <link {...props} rel="stylesheet" href={src} key={`style_${index}`} />);
}

function Script(props, context) {
  const { __scripts = [] } = context;
  const consumer = getConsumer(props);

  if (typeof consumer === 'function') {
    return consumer(__scripts);
  }

  // props such as type can be passed to script tag
  // script default crossorigin value is anonymous
  return __scripts.map(
    (src, index) => <script crossorigin="anonymous" {...props} src={src} key={`script_${index}`}>
      {/* self-closing script element will not work in HTML */}
    </script>
  );
}

function App(props, context) {
  const config = props.config || {};
  const routes = config.routes || [];

  const pagePath = context.__pagePath;

  const currentPageInfo = routes.find((route) => {
    return route.path == pagePath;
  });

  const consumer = getConsumer(props);

  if (typeof consumer === 'function') {
    return consumer(currentPageInfo);
  }

  return props.children;
}

function getConsumer(props) {
  return Array.isArray(props.children) ? props.children[0] : props.children
}

export {
  Root,
  Data,
  Style,
  Script,
  App,
  Manifest
};
