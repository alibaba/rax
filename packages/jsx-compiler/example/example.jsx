import { createElement, useState, Component } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Button from './src/components/Button';
import './example.css';

const number = 23;
const defaultBar = number;

export default function(props) {
  const [ bar, setBar ] = useState(defaultBar);
  return (
    <View className="container"
    >
      <Button>Child Nodes</Button>
      <Text>hello world: {bar}</Text>
    </View>
  );
}

// export default class extends Component {
//   render() {
//     let block;
//     if (foo === 1) {
//       block = <view />;
//     } else if (foo === 2) {
//       block = <image />;
//     } else {
//       block = <text />;
//     }
//     const styleObj = { width: 100 };
//     const str = 'hello world';
//     return <View
//       style={{ color: 'red' }}
//       call1={fn()}
//       call2={fn.method()}
//       identifier={alias}
//       prop={this.props.foo}
//       state={this.state.bar}
//       member={foo.bar}
//       obj={{ value }}
//       arr={[arr]}
//       string={'string'}
//       number={123}
//       bool={true}
//       null={null}
//       void={void 0}
//       undef={undefined}
//       className="container"
//       hello="world"
//       foo={bar}
//       onClick={() => setBar(bar + 1)}
//     >
//       { str }
//       <Text>Hello World</Text>
//     </View>;
//   }
// }
