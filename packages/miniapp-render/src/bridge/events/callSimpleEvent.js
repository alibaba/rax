import Event from '../../event/event';
import EventTarget from '../../event/event-target';

// Call simple node event, no bubbling
export default function(eventName, evt, domNode) {
  if (!domNode) return;

  EventTarget._process(domNode, new Event({
    name: eventName,
    target: domNode,
    eventPhase: Event.AT_TARGET,
    detail: evt && evt.detail,
    __extra: evt && evt.extra,
    bubbles: false,
  }));
}
