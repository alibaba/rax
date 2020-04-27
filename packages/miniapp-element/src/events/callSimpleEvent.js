import { $$adapter } from 'miniapp-render';

const { Event, EventTarget } = $$adapter;

// Call simple node event, no bubbling
export default function(eventName, evt, domNode) {
  if (!domNode) return;

  EventTarget.$$process(domNode, new Event({
    name: eventName,
    target: domNode,
    eventPhase: Event.AT_TARGET,
    detail: evt && evt.detail,
    $$extra: evt && evt.extra,
    bubbles: false,
  }));
}
