import Driver from './Driver';
import { nodesMap } from './Node';
import createBridge from './bridge';

export default class KrakenDriver extends Driver {
  constructor() {
    super();
    const { postMessage, addEventListener } = createBridge();
    this.postMessage = postMessage;
    addEventListener((event) => this.handleMessage(event));
  }

  handleMessage(payload) {
    const action = payload[0];
    const target = nodesMap.get(payload[1][0]);
    const arg = payload[1][1];

    if (action === 'event') {
      this.handleEvent(target, arg);
    } else {
      console.error(`ERROR: Unknown action from backend ${action}, with arg: ${JSON.stringify(arg)}`);
    }
  }

  handleEvent(currentTarget, event) {
    const target = nodesMap.get(event.target);
    event.targetId = event.target;
    event.target = target;

    event.currentTargetId = event.currentTarget;
    event.currentTarget = currentTarget;

    if (currentTarget) {
      currentTarget.dispatchEvent(event);
    }
  }
}
