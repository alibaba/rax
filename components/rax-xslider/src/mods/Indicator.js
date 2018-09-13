/** @jsx createElement */

'use strict';

import {createElement, Component} from 'rax';
import View from 'rax-view';

class Indicator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: props.defaultIndex || 0
    };
  }

  switchTo = (index) => {
    this.setState({index});
  }

  shouldComponentUpdate(nextState) {
    return this.state.index !== nextState.index;
  }

  render() {
    let {panels, itemStyle, activeItemStyle} = this.props;

    return (<View style={[styles.container, {...this.props.style}]}>
      {panels.map((panel, i) => {
        let isCurrent = i === this.state.index;
        return <View style={[styles.circle, itemStyle, isCurrent ? [styles.cur, activeItemStyle] : {}]} key={i} />;
      })}
    </View>);
  }
}

const styles = {
  container: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 10,
    width: 750,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    margin: 5,
    backgroundColor: '#ccc'
  },
  cur: {
    backgroundColor: '#f60'
  }
};


export default Indicator;