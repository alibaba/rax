import { $$adapter } from 'miniapp-render';

const { Event } = $$adapter;

export default function callSingleEvent(eventName, evt, nativeComponent) {
  const domNode = nativeComponent.getDomNodeFromEvt(eventName, evt);
  if (!domNode) return;

  domNode.$$trigger(eventName, {
    event: new Event({
      timeStamp: evt && evt.timeStamp,
      touches: evt && evt.touches,
      changedTouches: evt && evt.changedTouches,
      name: eventName,
      target: domNode,
      eventPhase: Event.AT_TARGET,
      detail: evt && evt.detail,
      $$extra: evt && evt.extra,
    }),
    currentTarget: domNode,
  });
}
