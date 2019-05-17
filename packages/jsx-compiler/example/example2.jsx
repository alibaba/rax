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
  constructor(props) {
    super(props);
    this.state = {
      list: [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }],
      bgHeight: 100,
      bgImage: 'www.picture.com'
    };
  }

  render() {
    return <View>
      <Text>Hello World</Text>
      {this.state.list.map((row, idx) => {
        return <View onClick={() => {console.log('this is function');}}>
          <View style={{
            width: 750,
            height: parseInt(this.state.bgHeight),
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Image className='horizontal' source={this.state.bgImage} />
            {row.name === 'aaa' ? <View>bbb</View> : <View>bbbb</View>}
            {row.name === 'bbb' ? null : <View>bbbb</View>}
            <Text key={idx}>{row.name}</Text>
            <Touchable onPress={this.onPress}>点击跳转</Touchable>
          </View>
        </View>;
      })}
    </View>;
  }
}
