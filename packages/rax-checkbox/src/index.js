import {Component, createElement, PropTypes} from 'rax';
import Image from 'rax-image';
import Text from 'rax-text';
import View from 'rax-view';
import Touchable from 'rax-touchable';

const CB_ENABLED_IMAGE = '//gw.alicdn.com/tfs/TB1W2fpQXXXXXcLaXXXXXXXXXXX-26-26.png';
const CB_DISABLED_IMAGE = '//gw.alicdn.com/tfs/TB1jWYvQXXXXXaOXVXXXXXXXXXX-26-26.png';

class CheckBox extends Component {

  constructor(props) {
    super(props);

    this.state = {
      internalChecked: false
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    if (this.props.onChange && typeof this.props.checked === 'boolean') {
      this.props.onChange(this.props.checked);
    } else {
      let internalChecked = this.state.internalChecked;

      if (this.props.onChange) {
        this.props.onChange(internalChecked);
      }
      this.setState({
        internalChecked: !internalChecked
      });
    }
  }

  render() {
    let container, source;

    if (typeof this.props.checked === 'boolean') {
      source = this.props.checked ? this.props.checkedImage : this.props.uncheckedImage;
    } else {
      source = this.state.internalChecked ? this.props.checkedImage : this.props.uncheckedImage;
    }

    if (this.props.labelBefore) {
      container =
        <View style={this.props.containerStyle || [styles.container, styles.flexContainer]}>
          <View style={styles.labelContainer}>
            <Text numberOfLines={this.props.labelLines} style={[styles.label, this.props.labelStyle]}>{this.props.label}</Text>
          </View>
          <Image
            style={[styles.checkbox, this.props.checkboxStyle]}
            source={{uri: source}} />
        </View>
      ;
    } else {
      container =
        <View style={[styles.container, this.props.containerStyle]}>
          <Image
            style={[styles.checkbox, this.props.checkboxStyle]}
            source={{uri: source}} />
          <View style={styles.labelContainer}>
            <Text numberOfLines={this.props.labelLines} style={[styles.label, this.props.labelStyle]}>{this.props.label}</Text>
          </View>
        </View>
      ;
    }

    return (
      <Touchable onPress={this.onChange} underlayColor={this.props.underlayColor} style={styles.flexContainer}>
        {container}
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
  },
  labelContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  label: {
    fontSize: 30,
    color: 'grey'
  }
};


CheckBox.defaultProps = {
  label: 'Label',
  labelLines: 1,
  labelBefore: false,
  checked: null,
  checkedImage: CB_ENABLED_IMAGE,
  uncheckedImage: CB_DISABLED_IMAGE,
  underlayColor: 'white'
};

module.exports = CheckBox;