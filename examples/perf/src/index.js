import {createElement, Component, render, PureComponent} from 'rax';
import Text from 'rax-text';
import View from 'rax-view';
import Perf from 'universal-perf';

class ChildOne extends Component {
  render() {
    const {clickChild} = this.props;
    return (
      <View onClick={clickChild}>child one</View>
    );
  }
}

class ChildTwo extends Component {
  render() {
    const {update} = this.props;
    return (
      <View style={{
        color: update ? '#ff0000' : '#ffff00'
      }}>{update ? 'child two update' : 'child two'}</View>
    );
  }
}

class ChildThree extends PureComponent {
  render() {
    return (
      <View>child three</View>
    );
  }
}

class ChildFour extends Component {
  render() {
    return (
      <View>child four</View>
    );
  }
}

class PerfTest extends Component {
  state = {
    childUpdate: false
  };
  render() {
    const {childUpdate} = this.state;
    return <View>
      <View>
        <Text>hello</Text>
        <Text>world</Text>
      </View>
      <ChildOne clickChild={() => {
        Perf.start();
        this.setState({
          childUpdate: true
        });

        Perf.stop();
        let measurements = Perf.getLastMeasurements();

        console.log('click child1 print wasted');
        Perf.printWasted(measurements);
        console.log('click child1 print operations');
        Perf.printOperations(measurements);
      }} />
      <ChildTwo update={childUpdate} />
      <ChildThree />
      {childUpdate ? <ChildFour /> : null}
    </View>;
  }
}

const styles = {
  title: {
    color: '#ff4400',
    fontSize: 48,
    fontWeight: 'bold',
  }
};

Perf.start();
render(<PerfTest name="world" />, null, {
  measurer: Perf.Measurer
});
Perf.stop();

let measurements = Perf.getLastMeasurements();
Perf.printInclusive(measurements);
Perf.printExclusive(measurements);
