import {createElement, Component} from 'rax';

// Inspired by bootstrap http://getbootstrap.com/
class Tip extends Component {
  static defaultProps = {
    type: 'success',
    value: ''
  };

  render() {
    const {type, value, style} = this.props;

    return (
      <div style={[styles.tip, styles['tip-' + type], style]}>
        <text style={[styles['tip-txt'], styles['tip-txt-' + type]]}>{value}</text>
      </div>
    );
  }
}

const styles = {
  tip: {
    paddingLeft: 36,
    paddingRight: 36,
    paddingTop: 36,
    paddingBottom: 36,
    borderRadius: 10
  },
  'tip-txt': {
    fontSize: 28
  },
  'tip-success': {
    backgroundColor: '#dff0d8',
    borderColor: '#d6e9c6'
  },
  'tip-txt-success': {
    color: '#3c763d'
  },
  'tip-info': {
    backgroundColor: '#d9edf7',
    borderColor: '#bce8f1'
  },
  'tip-txt-info': {
    color: '#31708f'
  },
  'tip-warning': {
    backgroundColor: '#fcf8e3',
    borderColor: '#faebcc'
  },
  'tip-txt-warning': {
    color: '#8a6d3b'
  },
  'tip-danger': {
    backgroundColor: '#f2dede',
    borderColor: '#ebccd1'
  },
  'tip-txt-danger': {
    color: '#a94442'
  },
};

export default Tip;
