import getDomNodeFromEvt from './events/getDomNodeFromEvt';
import baseEvents from './events/baseEvents';
import simpleEvents from './events/simpleEvents';
import callEvent from './events/callEvent';
import callSimpleEvent from './events/callSimpleEvent';
import callSingleEvent from './events/callSingleEvent';
import cache from '../utils/cache';

export default function(pageId) {
  const config = {};
  // Add get DOM Node from event method
  config.getDomNodeFromEvt = getDomNodeFromEvt;
  // Add call event method
  config.callEvent = callEvent;
  // Add call simple event method
  config.callSimpleEvent = callSimpleEvent;
  // Add call single event method
  config.callSingleEvent = callSingleEvent;
  // Add reactive event define which will bubble
  baseEvents.map(({name, extra = null, eventName}) => {
    config[name] = function(evt) {
      if (!pageId) {
        pageId = this.properties && this.properties.r.pageId;
      }
      const document = cache.getDocument(pageId);
      if (document && document.__checkEvent(evt)) {
        const nodeId = evt.currentTarget.dataset.privateNodeId;
        this.callEvent(eventName, evt, extra, pageId, nodeId); // Default Left button
      }
    };
  });
  // Add reactive event define which won't bubble
  simpleEvents.map(({name, eventName}) => {
    config[name] = function(evt) {
      const nodeId = evt.currentTarget.dataset.privateNodeId;
      const targetNode = cache.getNode(this.pageId, nodeId);
      if (!targetNode) return;
      this.callSimpleEvent(eventName, evt, targetNode);
    };
  });
  return config;
}
