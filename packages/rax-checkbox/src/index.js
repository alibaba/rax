import {Component, createElement, PropTypes} from 'rax';
import Image from 'rax-image';
import Text from 'rax-text';
import View from 'rax-view';
import Touchable from 'rax-touchable';

const CHECKBOX_ENABLED_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURUxpcTMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzLRwScAAAAPdFJOUwDvEI8wz69QQL/fIHCAYDHs4yUAAACoSURBVCjPfdIBDoMgDAXQ31JE1K33v60UZSJ2NjEmvvgpUIAD6aMoMMBR3YqMoBpmDDXbV1B5nApKUB3/kU9ZR1QLDcKklACPJmvCpWSSPWLbJK0e1bgNDrW4J/3iLmLbSov7oqNyjtFsM5nQUzyOc61xfKPlOOpsr4QbSb0x6uKuNqTdZovrmm+W8KDTJjhUbeGB5LS8SDcChV4GwB0bqWPzMmz/R3QHJwAPwC8jHWQAAAAASUVORK5CYII=';
const CHECKBOX_DISABLED_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAYUExURUxpcTMzMzMzMzMzMzMzMzMzMzMzMzMzM2vW5DoAAAAHdFJOUwCPEO9AzzBOX/xUAAAASklEQVQoz+2SMRKAQAwCIcmF///YaKl4tYU7Q8O2CwRTD5IBxJJlBSixcKPOFzkzUAmpnGppFCy/+qpqZ2rUJgCbTV/ZbGJ7T/QAwyIE71akwQMAAAAASUVORK5CYII=';

class CheckBox extends Component {

  static defaultProps = {
    checked: null,
    checkedImage: CHECKBOX_ENABLED_ICON,
    uncheckedImage: CHECKBOX_DISABLED_ICON,
  };

  constructor(props) {
    super(props);

    this.state = {
      internalChecked: false
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    const {checked, onChange} = this.props;

    if (onChange && typeof checked === 'boolean') {
      onChange(checked);
    } else {
      let internalChecked = this.state.internalChecked;

      if (onChange) {
        onChange(!internalChecked);
      }
      this.setState({
        internalChecked: !internalChecked
      });
    }
  }

  render() {
    let container, source;
    const {
      checked,
      checkedImage,
      uncheckedImage,
      containerStyle,
      checkboxStyle,
    } = this.props;

    if (typeof checked === 'boolean') {
      source = checked ? checkedImage : uncheckedImage;
    } else {
      source = this.state.internalChecked ? checkedImage : uncheckedImage;
    }

    return (
      <Touchable onPress={this.onChange} style={styles.flexContainer}>
        <View style={[styles.container, containerStyle]}>
          <Image
            style={[styles.checkbox, checkboxStyle]}
            source={{uri: source}} />
        </View>
      </Touchable>
    );
  }
}

var styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 40,
    height: 40
  }
};

export default CheckBox;
