import {Component, createElement} from 'rax';
import {isWeex} from 'universal-env';
import Text from 'rax-text';
import Touchable from 'rax-touchable';

class Button extends Component {

  static propTypes = {};

  render() {
    const props = this.props;
    const buttonStyles = [styles.button, props.style];
    const textStyles = [styles.text];

    if (props.color) {
      textStyles.push({color: props.color});
    }

    if (props.disabled) {
      buttonStyles.push(styles.buttonDisabled);
      textStyles.push(styles.textDisabled);
    }

    let content = props.children || props.title;
    if (typeof content === 'string') {
      content = <Text style={textStyles}>{content}</Text>;
    }

    return (
      <Touchable {...props} style={buttonStyles}>
        {content}
      </Touchable>
    );
  }
}

const styles = {
  button: {},
  text: {
    color: '#0C42FD',
    textAlign: 'center',
    padding: 16,
    fontSize: 36,
  },
  buttonDisabled: {},
  textDisabled: {
    color: '#cdcdcd',
  },
};

export default Button;
