/**
 * weex button
 *
 * props: disabled, style
 */

export default {
  parse(component) {
    const {props} = component;
    component.type = 'view';

    const {style, disabled, children} = props;

    let destTextStyle = {
      color: '#0C42FD',
      textAlign: 'center',
      padding: 16,
      fontSize: 36,
      ...style
    };

    if (disabled) {
      props.onClick = null;
      destTextStyle = {...destTextStyle, ...{
        color: '#cdcdcd'
      }};
    }

    if (typeof children === 'string') {
      props.children = {
        type: 'text',
        props: {
          style: destTextStyle,
          value: children
        }
      };
    }

    return component;
  }
};
