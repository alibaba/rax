import {Component, createElement, setNativeProps} from 'rax';
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


function getText(event) {
  let text;
  if (isWeex) {
    text = event.value;
  } else {
    text = event.target.value;
  }
  return text;
}

function genEventObject(originalEvent) {
  let text = getText(originalEvent);
  return {
    nativeEvent: {
      text
    },
    value: text,
    originalEvent,
  };
}

class TextInput extends Component {

  handleInput = (event) => {
    this.props.onInput(genEventObject(event));
  };

  handleChange = (event) => {
    if (this.props.onChange) {
      this.props.onChange(genEventObject(event));
    }

    if (this.props.onChangeText) {
      let text = getText(event);
      this.props.onChangeText(text);
    }
  };

  handleFocus = (event) => {
    this.props.onFocus(genEventObject(event));
  };

  handleBlur = (event) => {
    this.props.onBlur(genEventObject(event));
  };

  focus = () => {
    this.refs.input.focus && this.refs.input.focus();
  };

  blur = () => {
    this.refs.input.blur && this.refs.input.blur();
  };

  clear = () => {
    setNativeProps(this.refs.input, {value: ''});
  };

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
      id,
      ref: 'input'
    };

    if (typeof editable !== 'undefined' && !editable) {
      propsCommon.readOnly = true;
    }

    let type = typeMap[keyboardType];
    if (password || secureTextEntry) {
      type = 'password';
    }

    if (isWeex) {
      // Diff with web readonly attr, `disabled` must be boolean value
      let disabled = Boolean(propsCommon.readOnly);

      if (multiline) {
        return <textarea {...propsCommon} rows={20} disabled={disabled} />;
      } else {
        // https://github.com/alibaba/weex/blob/dev/doc/components/input.md
        return <input {...propsCommon} type={type} disabled={disabled} />;
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
    paddingLeft: 24,
    fontSize: 24,
    lineHeight: 60,
    height: 60, // default height
  }
};

export default TextInput;
