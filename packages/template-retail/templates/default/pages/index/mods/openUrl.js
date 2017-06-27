import { createElement, PropTypes as T } from 'rax';
import { TouchableHighlight } from 'rax-components';

function openUrl(props) {
  const { url, onClick, component, children, onPress, ...others } = props;
  if (component) {
    const TouchableComponent = component;
    return (
      <TouchableComponent
        onClick={turnToPage(url, onClick)}
        {...others}>
        {children}
      </TouchableComponent>
    );
  }

  return (
    <TouchableHighlight
      onPress={turnToPage(url, onPress || onClick)}
      {...others}>
      {children}
    </TouchableHighlight>
  );
}

openUrl.propTypes = {
  url: T.string.isRequired,
  onClick: T.func,
  component: T.object,
  children: T.node,
  onPress: T.func
};

const noop = () => {};
function turnToPage(url, onClick = noop) {
  return () => {
    // 其他兼容
    onClick();
  };
}

export default openUrl;