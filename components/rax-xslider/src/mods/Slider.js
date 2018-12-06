/** @jsx createElement */


'use strict';

import {createElement, Component, findDOMNode, setNativeProps} from 'rax';
import {isWeex} from 'universal-env';
import DefaultView from './views/DefaultView';
import {FULL_WIDTH} from './Constant';
import ListView from './views/ListView';


const styles = {
  container: {
    overflow: 'hidden',
    width: FULL_WIDTH
  }
};


class Slider extends Component {
  switchTo(index, options, callback) {
    this.refs.content.switchTo(index, options, callback);
  }
  
  stopAutoPlay() {
    this.refs.content.stopAutoPlay();
  }

  autoPlay() {
    this.refs.content.autoPlay();
  }

  render() {
    let {style = {}, useListView} = this.props;

    let commonProps = {
      ...this.props,
      style: {...styles.container, ...style},
      ref: 'content'
    };

    return isWeex && useListView ? <ListView
      {...commonProps}
      loop={false}
      vertical={true} // force vertical in list mode
      startGap={0}
      endGap={0}
    />
      : <DefaultView
        {...commonProps}
        ref="content" />;
  }
}

export default Slider;
