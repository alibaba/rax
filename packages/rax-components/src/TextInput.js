import {Component, createElement} from 'rax';
import {isWeex} from 'universal-env';

const typeMap = {
  'default': 'text',
  'ascii-capable': 'text',
  'numbers-and-punctuation': 'number',
  'url': 'url',
  'number-pad': 'number',
  'phone-pad': 'tel',
  'name-phone-pad': 'text',
  'email-address': 'email',
  'decimal-pad': 'number',
  'twitter': 'text',
  'web-search': 'search',
  'numeric': 'number'
};

class TextInput extends Component {

  handleInput = (e) => {
    let text = e.value;
    // Shim Event
    if (isWeex) {
      e = {
        nativeEvent: {
          text
        },
        value: text
      };
    }
    this.props.onInput(e);
  };

  handleChange = (e) => {
    let text = e.value;
    // Shim Event
    if (isWeex) {
      e = {
        nativeEvent: {
          text
        },
        value: text
      };
    }

    this.props.onChange && this.props.onChange(e);
    this.props.onChangeText && this.props.onChangeText(text);
  };

  handleFocus = (e) => this.props.onFocus(e);
  handleBlur = (e) => this.props.onBlur(e);

  render() {
    const {
      accessibilityLabel,
      autoComplete,
      autoFocus,
      editable,
      keyboardType,
      maxLength,
      maxNumberOfLines,
      multiline,
      numberOfLines,
      onBlur,
      onFocus,
      onChange,
      onChangeText,
      onInput,
      placeholder,
      password,
      secureTextEntry,
      style,
      value,
      id
    } = this.props;

    let propsCommon = {
      'aria-label': accessibilityLabel,
      autoComplete: autoComplete && 'on',
      autoFocus,
      maxLength,
      onChange: (onChange || onChangeText) && this.handleChange,
      onInput: onInput && this.handleInput,
      onBlur: onBlur && this.handleBlur,
      onFocus: onFocus && this.handleFocus,
      placeholder,
      style: {
        ...styles.initial,
        ...style
      },
      value,
      id
    };

    if (typeof editable !== 'undefined' && !editable) {
      propsCommon.readOnly = true;
    }

    let type = typeMap[keyboardType];
    if (password || secureTextEntry) {
      type = 'password';
    }

    if (isWeex) {
      if (multiline) {
        return <textarea {...propsCommon} rows={20} disabled={propsCommon.readOnly} />;
      } else {
        // https://github.com/alibaba/weex/blob/dev/doc/components/input.md
        return <input {...propsCommon} type={type} disabled={propsCommon.readOnly} />;
      }
    } else {
      let input;
      if (multiline) {
        const propsMultiline = {
          maxRows: maxNumberOfLines || numberOfLines,
          minRows: numberOfLines
        };

        input = <textarea {...propsCommon} {...propsMultiline} >{propsCommon.value}</textarea>;
      } else {
        input = <input {...propsCommon} type={type} />;
      }

      return input;
    }
  }
}

const styles = {
  initial: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderColor: '#000000',
    borderWidth: 0,
    boxSizing: 'border-box',
    color: '#000000',
    padding: 0,
    paddingLeft: '8rem',
    lineHeight: '24rem',
    fontSize: '24rem',
    height: '36rem', // default height
  }
};

export default TextInput;
