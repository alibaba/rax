/**
 * weex button
 *
 * props: disabled, style
 */

export default {
  parse(component) {
    const {props} = component;
    component.type = 'text';

    const {style, disabled, children} = props;

    let textStyle = {
      textAlign: 'center',
      fontSize: 22,
      paddingTop: 4,
      paddingRight: 12,
      paddingBottom: 6,
      paddingLeft: 12,
      borderWidth: 4,
      borderStyle: 'solid',
      borderColor: '#000000',
      backgroudColor: '#c0c0c0',
      ...style
    };

    if (disabled) {
      props.onClick = null;
      textStyle = {
        ...textStyle,
        ...{
          color: '#7f7f7f',
          borderColor: '#7f7f7f',
        }
      };
    }

    if (typeof children === 'string') {
      props.value = children;
      props.children = null;
    }

    return component;
  }
};
