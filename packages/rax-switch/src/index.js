import {Component, createElement} from 'rax';
import {isWeex} from 'universal-env';

const DEFAULT_WIDTH = 100;
const DEFAULT_HEIGHT = 60;

class Switch extends Component {

  static propTypes = {};

  static defaultProps = {
    onTintColor: '#00e158',
    thumbTintColor: '#ffffff',
    tintColor: '#ffffff'
  }

  handleClick = (e) => {
    if (this.props.disabled) {
      return null;
    }
    var newVal = !this.props.value;
    this.props.onValueChange && this.props.onValueChange.call(this, newVal);
  };

  getStyles() {
    return {
      span: {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        minWidth: DEFAULT_WIDTH,
        minHeight: DEFAULT_HEIGHT,
        borderRadius: 40,
        position: 'relative',
        display: 'inline-block',
        margin: 4,
        padding: 0,
        cursor: 'default', // pointer will cause a grey background color on chrome
        verticalAlign: 'middle',
        borderColor: '#dfdfdf',
        borderWidth: '1px',
        borderStyle: 'solid',
        WebkitUserSelect: 'none',
        WebkitBoxSizing: 'content-box',
        WebkitBackfaceVisibility: 'hidden'
      },
      checkedSpan: {
        borderColor: this.props.onTintColor,
        backgroundColor: this.props.onTintColor,
        boxShadow: this.props.onTintColor + ' 0 0 0 16px inset',
        WebkitTransition: 'border 0.2s, box-shadow 0.2s, background-color 1s'
      },
      uncheckedSpan: {
        borderColor: '#dfdfdf',
        backgroundColor: this.props.tintColor,
        boxShadow: '#dfdfdf 0 0 0 0 inset',
        WebkitTransition: 'border 0.2s, box-shadow 0.2s'
      },
      disabledSpan: {
        opacity: 0.5,
        cursor: 'not-allowed',
        boxShadow: 'none'
      },
      small: {
        position: 'absolute',
        top: 0,
        width: 60,
        height: 60,
        backgroundColor: this.props.thumbTintColor,
        borderRadius: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        WebkitTransition: '-webkit-transform 0.2s ease-in'
      },
      checkedSmall: {
        WebkitTransform: 'translateX(40rem)' // should with rem unit that the value is string type
      },
      uncheckedSmall: {
        WebkitTransform: 'translateX(0)'
      }
    };
  }

  render() {
    const { style, value, disabled, onValueChange, ...others} = this.props;
    if (isWeex) {
      let nativeProps = {
        style: {
          ...styles.initial,
          ...style
        },
        checked: value,
        disabled: disabled,
        onChange: ({value}) => onValueChange(value)
      };

      return (
        <switch {...nativeProps} {...others} />
      );
    } else {
      let styles = this.getStyles();
      let spancss = value ? {...styles.span, ...styles.checkedSpan} : {...styles.span, ...styles.uncheckedSpan};
      let smallcss = value ? {...styles.small, ...styles.checkedSmall} : {...styles.small, ...styles.uncheckedSmall};
      spancss = disabled ? {...spancss, ...styles.disabledSpan} : spancss;
      spancss = {
        ...style,
        ...spancss
      };

      return (
        <span onClick={this.handleClick} style={spancss} {...others}>
          <small style={smallcss} />
        </span>
      );
    }
  }
}

const styles = {
  initial: {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
};

export default Switch;
