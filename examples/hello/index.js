import {createElement, Component, render} from 'rax';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';

class Hello extends Component {
  state = {
    fontColor: '#333333',
  };

  handleClick(){
    console.log('clicked');
  }
  render() {
    return (<p onClick={this.handleClick} style={{fontWeight: 'bold', color: this.state.fontColor}}>
      Hello {this.props.name}!
    </p>);
  }
}

render(<Hello name="world" />);
