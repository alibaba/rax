import Host from '../vdom/host';
import ServerDriver from '../drivers/server';
import render from '../render';
import Serializer from './serializer';

export default function renderToString(element) {
  Host.driver = ServerDriver;
  Host.roots = {};
  let body = ServerDriver.createBody();
  render(element, body);
  return new Serializer(body).serialize();
}
