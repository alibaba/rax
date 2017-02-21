import Host from '../vdom/host';
import ServerDriver from '../drivers/server';
import render from '../render';
import Serializer from './serializer';
import {addRenderedMarkedToElement} from './renderedMarked';

export default function renderToString(element) {
  // Reset driver iternal state
  ServerDriver.nodeMaps = {};
  ServerDriver.nodeCounter = 0;

  // Reset host state
  Host.rootComponents = {};
  Host.rootInstances = {};
  Host.mountID = 1;

  let body = ServerDriver.createBody();
  render(element, body, ServerDriver);

  // Add rendered marked to root ChildNodes
  if (body.childNodes) {
    for (let i = 0; i < body.childNodes.length; i ++) {
      body.childNodes[i] = addRenderedMarkedToElement(body.childNodes[i], 'server');
    }
  }

  let markup = new Serializer(body).serialize() || '';

  return markup;
}
