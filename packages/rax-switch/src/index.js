import {Component, createElement} from 'rax';
import {isWeex} from 'universal-env';

const DEFAULT_WIDTH = 100;
const DEFAULT_HEIGHT = 60;

class Switch extends Component {

  static defaultProps = {
    onTintColor: '#00e158',
    thumbTintColor: '#fff',
    tintColor: '#fff'
  }

  state = {
    value: this.props.value,
  };

  handleClick = (e) => {
    if (this.props.disabled) {
      return null;
    }

    var newVal = !this.state.value;
    this.props.onValueChange && this.props.onValueChange.call(this, newVal);
    this.setState({
      value: newVal
    });

    var oldValue = this.props.value;
    setTimeout(() => {
      if (this.props.value == oldValue) {
        this.setState({
          value: this.props.value
        });
      }
    }, 200);
  };

  getStyles() {
    return {
      span: {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        borderRadius: 40,
        position: 'relative',
        display: 'inline-block',
        margin: 4,
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
    if (isWeex) {
      let nativeProps = {
        style: {
          ...styles.initial,
          ...this.props.style
        },
        checked: this.state.value,
        disabled: this.props.disabled,
        onChange: ({value}) => this.props.onValueChange(value)
      };

      return (
        <switch {...nativeProps} />
      );
    } else {
      let styles = this.getStyles();
      let spancss = this.state.value ? {...styles.span, ...styles.checkedSpan} : {...styles.span, ...styles.uncheckedSpan};
      let smallcss = this.state.value ? {...styles.small, ...styles.checkedSmall} : {...styles.small, ...styles.uncheckedSmall};
      spancss = this.props.disabled ? {...spancss, ...styles.disabledSpan} : spancss;

      return (
        <span onClick={this.handleClick} style={spancss}>
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
