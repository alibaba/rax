import ServerDriver from 'driver-server';
import Host from '../vdom/host';
import render from '../render';
import Serializer from './serializer';

const RENDERED_NAME = 'data-rendered';
const CACHE_KEY_NAME = 'data-cache-key';

/**
 * Add renered mark to element
 */
function addRenderedMark(element, markedValue) {
  if (!element || !element.attributes) {
    return element;
  }

  element.attributes[RENDERED_NAME] = markedValue;
  return element;
}

export default function renderToString(element) {
  // Reset driver iternal state
  ServerDriver.nodeMaps = {};

  // Reset host state
  Host.rootComponents = {};
  Host.rootInstances = {};
  Host.mountID = 1;

  let body = ServerDriver.createBody();
  render(element, body, {
    driver: ServerDriver
  });

  // Add rendered mark to root ChildNodes
  if (body.childNodes) {
    for (let i = 0; i < body.childNodes.length; i ++) {
      body.childNodes[i] = addRenderedMark(body.childNodes[i], 'server');
    }
  }

  let markup = new Serializer(body).serialize() || '';

  return markup;
}
