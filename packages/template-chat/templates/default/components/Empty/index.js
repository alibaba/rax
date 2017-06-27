import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';

export default class Empty extends Component {

  render() {
    return (
      <View>
        <Text>Nothing</Text>
      </View>
    );
  }
}
