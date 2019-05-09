import { createElement, useState, Component } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Container from './components/Container';
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
    return <View><Text>Hello World</Text></View>;
  }
}
