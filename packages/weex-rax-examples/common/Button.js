import {createElement, Component, render} from 'rax';

class Button extends Component {
  static defaultProps = {
    type: 'default',
    size: 'large',
    value: ''
  };

  render() {
    const {type, size, value, style, onClick} = this.props;
    return (
      <div onClick={onClick} style={[styles.btn, styles['btn-' + type], styles['btn-sz-' + size], style]}>
        <text style={[styles['btn-txt'], styles['btn-txt-' + type], styles['btn-txt-sz-' + size]]}>{value}</text>
      </div>
    );
  }
}

const styles = {
  btn: {
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#333333'
  },
  'btn-txt': {

  },
  'btn-default': {
    color: 'rgb(51, 51, 51)'
  },
  'btn-primary': {
    backgroundColor: 'rgb(40, 96, 144)',
    borderColor: 'rgb(40, 96, 144)'
  },
  'btn-success': {
    backgroundColor: 'rgb(92, 184, 92)',
    borderColor: 'rgb(76, 174, 76)'
  },
  'btn-info': {
    backgroundColor: 'rgb(91, 192, 222)',
    borderColor: 'rgb(70, 184, 218)'
  },
  'btn-warning': {
    backgroundColor: 'rgb(240, 173, 78)',
    borderColor: 'rgb(238, 162, 54)'
  },
  'btn-danger': {
    backgroundColor: 'rgb(217, 83, 79)',
    borderColor: 'rgb(212, 63, 58)'
  },
  'btn-link': {
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
  'btn-txt-default': {
    color: 'rgb(51, 51, 51)'
  },
  'btn-txt-primary': {
    color: 'rgb(255, 255, 255)'
  },
  'btn-txt-success': {
    color: 'rgb(255, 255, 255)'
  },
  'btn-txt-info': {
    color: 'rgb(255, 255, 255)'
  },
  'btn-txt-warning': {
    color: 'rgb(255, 255, 255)'
  },
  'btn-txt-danger': {
    color: 'rgb(255, 255, 255)'
  },
  'btn-txt-link': {
    color: 'rgb(51, 122, 183)'
  },
  'btn-sz-large': {
    width: 300,
    height: 100,
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 15
  },
  'btn-sz-middle': {
    width: 240,
    height: 80,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 10
  },
  'btn-sz-small': {
    width: 170,
    height: 60,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 7
  },
  'btn-txt-sz-large': {
    fontSize: 45
  },
  'btn-txt-sz-middle': {
    fontSize: 35
  },
  'btn-txt-sz-small': {
    fontSize: 30
  },
  'disabled': {},
};

export default Button;
