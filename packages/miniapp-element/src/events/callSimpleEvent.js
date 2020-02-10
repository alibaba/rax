import { $$adapter } from 'miniapp-render';

const { Event } = $$adapter;

// Call simple node event
export default function(eventName, evt, domNode) {
  if (!domNode) return;

  domNode.$$trigger(eventName, {
    event: new Event({
      name: eventName,
      target: domNode,
      eventPhase: Event.AT_TARGET,
      detail: evt && evt.detail,
      $$extra: evt && evt.extra,
    }),
    currentTarget: domNode,
  });
}
