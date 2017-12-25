import {createElement, Component, render} from 'rax';
import Button from '../common/Button';
import Panel from '../common/Panel';

const modal = __weex_require__('@weex-module/modal');

class Example extends Component {
  toast(msg, duration) {
    if (!msg || typeof msg !== 'string') {
      msg = 'I am Toast show!';
    }
    duration = duration || 2;
    modal.toast({
      'message': msg,
      'duration': duration
    });
  }
  alert(msg, okTitle, cancelTitle) {
    if (!msg || typeof msg !== 'string') {
      msg = 'I am Alert!';
    }
    modal.alert({
      'message': msg,
      'okTitle': okTitle,
      'cancelTitle': cancelTitle
    }, function() {
      modal.toast({ message: 'Click Alert OK Bnt!!' });
    });
  }
  confirm(msg, okTitle, cancelTitle) {
    if (!msg || typeof msg !== 'string') {
      msg = 'I am Confirm!';
    }
    okTitle = okTitle || 'OK';
    cancelTitle = cancelTitle || 'Cancel';
    modal.confirm({
      'message': msg,
      'okTitle': okTitle,
      'cancelTitle': cancelTitle
    }, function(result) {
      modal.toast({ message: 'Click Confirm  ' + result });
    });
  }
  prompt() {
    modal.prompt( {
      'message': 'I am Prompt!',
      'okTitle': 'ok',
      'cancelTitle': 'cancel'
    }, function(result) {
      modal.toast({ message: 'Click Prompt  ' + result });
    });
  }
  render() {
    return (
      <scroller>
        <Panel title="Toast" type="primary">
          <Button type="primary" value="Toast" onClick={this.toast} />
        </Panel>

        <Panel title="Dialog" type="primary">
          <Button type="success" value="Alert" style={{marginBottom: 20}} onClick={this.alert} />
          <Button type="primary" value="Confirm" style={{marginBottom: 20}} onClick={this.confirm} />
          <Button type="warning" value="Prompt" onClick={this.prompt} />
        </Panel>
      </scroller>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
};

render(<Example />);
