/**
 * Client is an instance of a Page.
 * In IDE implementation, client is designed
 * to an iframe element with generated src-doc.
 */
import { createElement, Component } from 'rax';
import { createMessageChanel } from '../WorkerMessageChanel';
import { getIframeSrcDoc } from '../renderer/render';
import initRenderer from '../renderer';

const iframeContent = getIframeSrcDoc({
  viewport: screen.width / 750
});

export default class IframeClient {
  constructor(props) {
    const { pageName, clientId, pageQuery } = props;

    this.pageName = pageName;
    this.clientId = clientId;
    this.pageQuery = pageQuery;

    createMessageChanel(clientId, pageName);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      this.show();
    } else {
      this.hide();
    }
  }

  hide() {
    this.iframe.removeAttribute('data-show-iframe');
    this.iframe.style.display = 'none';
  }

  show() {
    this.iframe.setAttribute('data-show-iframe', '');
    this.iframe.style.display = 'block';
  }

  handleLoad = () => {
    /**
     * try to mark __current_page__ to iframe window.
     */
    try {
      this.iframe.contentWindow.__current_page__ = this.pageName;
    } catch (err) {}

    /**
     * If iframe url is cross domain, do not init renderer.
     */
    let needInit = false;
    try {
      needInit = this.iframe.contentWindow.location.href === 'about:srcdoc';
    } catch (e) {}
    needInit && initRenderer(this.iframe.contentWindow, this.clientId, this.pageQuery);
  };

  render() {
    const { clientId } = this.props;

    return (
      <iframe
        ref={ref => this.iframe = ref}
        style={styles.iframe}
        onLoad={this.handleLoad}
        data-iframe
        data-prev-client-id={clientId}
        scrolling="yes"
        sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-forms"
        srcDoc={iframeContent}
      />
    );
  }
}

let clients = 0;
function generateClientId() {
  return `client-${++clients}`;
}

export function createClient(pageName, pageQuery = {}) {
  return {
    pageName,
    pageQuery,
    clientId: generateClientId(),
  };
}

const styles = {
  iframe: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    borderWidth: 0,
  },
};
