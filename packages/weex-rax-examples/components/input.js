import {createElement, Component, render} from 'rax';
import Panel from '../common/Panel';

class Example extends Component {
  state = {
    txtInput: '',
    txtChange: '',
  };
  onchange = (event) => {
    this.state.txtInput = event.value;
    this.setState(this.state);
  }
  oninput = (event) => {
    this.state.txtChange = event.value;
    this.setState(this.state);
  }
  render() {
    return (
      <scroller>
        <panel title="input" type="primary">
          <input
            type="text"
            placeholder="Text Input"
            style={styles.input}
            autoFocus={true}
            value=""
            onChange={this.onchange}
            onInput={this.oninput}
          />
          <text>oninput: {this.state.txtInput}</text>
          <text>onchange: {this.state.txtChange}</text>
        </panel>
      </scroller>
    );
  }
}

const styles = {
  input: {
    fontSize: 60,
    height: 80,
    width: 400,
  }
};

render(<Example />);
