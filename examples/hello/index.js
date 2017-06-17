import {createElement, Component, render} from 'rax';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';

class Hello extends Component {
  render() {
    return <Text style={{color: '#333333'}}>
      <Text style={{fontWeight: 'bold'}}>
        Hello world,
      </Text>
      <Text style={{color: 'red'}}>
        Rax
      </Text>!
      Rax <Text style={{textDecoration: 'underline'}}>website</Text>:
      <Link href="//taobao.com" style={{color: 'blue'}}>
        <Image
          source={{uri: 'https://gw.alicdn.com/tfs/TB1g6AvPVXXXXa7XpXXXXXXXXXX-215-215.png'}}
          style={{
            width: 100,
            height: 100,
          }}
        />
        Click here
      </Link>.
    </Text>;
  }
}

render(<Hello name="world" />);
