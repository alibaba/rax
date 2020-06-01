import getDomNodeFromEvt from './events/getDomNodeFromEvt';
import callEvent from './events/callEvent';
import callSimpleEvent from './events/callSimpleEvent';

const baseEvents = [
  {
    name: 'onTap',
    eventName: 'click',
    extra: {
      button: 0
    }
  }
];

export default function() {
  const config = {};
  // Add get DOM Node from event method
  config.getDomNodeFromEvt = getDomNodeFromEvt;
  // Add call event method
  config.callEvent = callEvent;
  // Add call simple event method
  config.callSimpleEvent = callSimpleEvent;
  // Add native reactive event define
  baseEvents.map(({name, extra, eventName}) => {
    config[name] = function(evt) {
      if (this.document && this.document.$$checkEvent(evt)) {
        const nodeId = evt.currentTarget.dataset.privateNodeId;
        this.callEvent(eventName, evt, extra, nodeId); // Default Left button
      }
    };
  });
  return config;
}
