import Event from '../../event/event';


export default function(eventName, evt) {
  const domNode = this.getDomNodeFromEvt(eventName, evt);
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
