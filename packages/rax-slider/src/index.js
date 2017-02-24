import {Component, createElement, PropTypes} from 'rax';
import {isWeex} from 'universal-env';

class Slider extends Component {

  render() {
    if (isWeex) {
      return <slider {...this.props} />;
    } else {
      // TODO
    }
  }
}

export default Slider;
