
/** @jsx createElement */
import {createElement, Component} from 'rax';
import GestureView from 'rax-gesture-view';
import View from 'rax-view';

class GestureViewDemo extends Component {
  onHorizontalPan = (e) => {
    console.error('onHorizontalPan:' + e.state);
  }

  onVerticalPan = (e) => {
    console.error('onVerticalPan:' + e.state);
  }

  render() {
    return (<View style={{flex: 1}}>
      <GestureView style={{width: 300, height: 300, backgroundColor: 'red'}}
        onVerticalPan={this.onVerticalPan}
        onHorizontalPan={this.onHorizontalPan}
      >pan me</GestureView>
    </View>);
  }
}

export default GestureViewDemo;
