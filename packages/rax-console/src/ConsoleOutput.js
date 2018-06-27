import {createElement, Component} from 'rax';
import MessageContainer from './MessageContainer';
import './index.css';

export default class ConsoleOutput extends Component {
  render() {
    let visibleMessages = this.props.visibleMessages;
    let messages = this.props.messages;
    let timestampsVisible = this.props.timestampsVisible;

    let messageNodes = visibleMessages.map((messageId) => <MessageContainer
      key={messageId}
      messageId={messageId}
      timestampsVisible={timestampsVisible}
      getMessage={() => messages.get(messageId)}
    />);

    return <div className="console-output">
      <div className="console-messages">
        {messageNodes}
      </div>
    </div>;
  }
}