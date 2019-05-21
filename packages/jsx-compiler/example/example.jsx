import { createElement, useState, Component } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Button from './src/components/Button';
import './example.css';

const number = 23;
const defaultBar = number;

// export default function(props) {
//   const [ bar, setBar ] = useState(defaultBar);
//   return (
//     <View className="container" foo={bar} onClick={() => setBar(bar + 1)} hello="world">
//       <Container val={'value passed'}>Child Nodes</Container>
//       <Text>hello world: {bar}</Text>
//     </View>
//   );
// }

export default class extends Component {
  render() {
    const styleObj = { width: 100 };
    return <View style={{ color: 'red' }}>
      <Button style={styleObj} />
      <Text>Hello World</Text>
    </View>;
  }
}
