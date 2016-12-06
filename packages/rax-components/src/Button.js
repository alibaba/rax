import {Component, createElement} from 'rax';
import Text from './Text';
import TouchableHighlight from './TouchableHighlight';
import {isWeex} from 'universal-env';

class Button extends Component {
  render() {
    let props = this.props;
    let children = props.children;
    let style = {
      ...styles.initial,
      ...props.style
    };

    let content = children;
    if (typeof children === 'string') {
      content = <Text>{children}</Text>;
    }

    return (
      <TouchableHighlight {...props} style={style}>
        {content}
      </TouchableHighlight>
    );
  }
}

const styles = {
  initial: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: '60rem',
    paddingTop: '12rem',
    paddingBottom: '12rem',
    paddingLeft: '25rem',
    paddingRight: '25rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#666666',
  }
};

export default Button;
