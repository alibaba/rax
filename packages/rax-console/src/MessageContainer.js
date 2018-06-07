import {createElement, Component} from 'rax';
import ConsoleApiCall from './ConsoleApiCall';
import {
  DEFAULT_FILTERS,
  DEFAULT_FILTERS_VALUES,
  FILTERS,
  MESSAGE_TYPE,
  MESSAGE_SOURCE,
} from './const';

const componentMap = new Map([
  ['ConsoleApiCall', ConsoleApiCall],
  ['ConsoleCommand', () => {}],
  ['DefaultRenderer', () => {}],
  ['EvaluationResult', () => {}],
  ['NetworkEventMessage', () => {}],
  ['PageError', () => {}]
]);

function getMessageComponent(message) {
  if (!message) {
    return componentMap.get('DefaultRenderer');
  }

  switch (message.source) {
    case MESSAGE_SOURCE.CONSOLE_API:
      return componentMap.get('ConsoleApiCall');
    case MESSAGE_SOURCE.NETWORK:
      return componentMap.get('NetworkEventMessage');
    case MESSAGE_SOURCE.CSS:
    case MESSAGE_SOURCE.JAVASCRIPT:
      switch (message.type) {
        case MESSAGE_TYPE.COMMAND:
          return componentMap.get('ConsoleCommand');
        case MESSAGE_TYPE.RESULT:
          return componentMap.get('EvaluationResult');
        case MESSAGE_TYPE.LOG:
          return componentMap.get('PageError');
        default:
          return componentMap.get('DefaultRenderer');
      }
  }

  return componentMap.get('DefaultRenderer');
}

export default class MessageContainer extends Component {
  render() {
    const message = this.props.getMessage();
    let MessageComponent = getMessageComponent(message);
    return <MessageComponent message={message} {...this.props} />;
  }
}

