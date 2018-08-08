import {createElement} from 'rax';
import Message from './Message';
import ObjectInspector from './ObjectInspector';

export default function ConsoleApiCall(props) {
  const {
    message,
    timestampsVisible,
  } = props;

  const {
    id: messageId,
    source,
    type,
    level,
    timeStamp,
    parameters
  } = message;

  let messageBody = parameters.map((param, key) => {
    return (<div style={{display: 'inline-block', marginRight: '8px'}}>
      <ObjectInspector data={param} />
    </div>);
  });

  return <Message
    messageId={messageId}
    source={source}
    type={type}
    level={level}
    messageBody={messageBody}
    timeStamp={timeStamp}
    timestampsVisible={timestampsVisible}
  />;
}