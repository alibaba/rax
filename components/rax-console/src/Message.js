import {createElement, Component} from 'rax';
import './index.css';

function timestampString(milliseconds) {
  let d = new Date(milliseconds ? milliseconds : null);
  let hours = d.getHours(), minutes = d.getMinutes();
  let seconds = d.getSeconds();
  milliseconds = d.getMilliseconds();
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export default class Message extends Component {
  render() {
    const {
      source,
      type,
      level,
      messageBody,
      timeStamp,
      timestampsVisible,
    } = this.props;

    return (<div className={['console-message-wrapper', {
      'console-error-level': level === 'error',
      'console-warn-level': level === 'warn',
    }]}>
      <div className="console-message">
        {timestampsVisible ? <span className="console-message-timestamp">{timestampString(timeStamp)}</span> : null}
        <div className={['console-message-text', {
          'console-message-error-text': level === 'error',
          'console-message-warn-text': level === 'warn',
        }]}>{messageBody}</div>
      </div>
    </div>);
  }
}

