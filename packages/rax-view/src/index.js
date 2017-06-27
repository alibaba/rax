import {Component, createElement} from 'rax';
import {isWeex} from 'universal-env';

class View extends Component {

  static propTypes = {};

  render() {
    let props = this.props;
    if (isWeex) {
      // TODO: do not pass object value in props
      return <div {...props} />;
    } else {
      let styleProps = {
        ...styles.initial,
        ...props.style
      };
      return <div {...props} style={styleProps} />;
    }
  }
}

const styles = {
  initial: {
    border: '0 solid black',
    position: 'relative',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
    flexShrink: 0
  }
};

export default View;
