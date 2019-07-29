import { createElement } from 'rax';
import { Props } from '../types';
import styles from './style';

const MyComponent = (props: Props) => {
  const { style, ...rest } = props;
  let styleProps = {
    ...styles.initial,
    ...style
  };
  return (
    <span {...rest} style={styleProps}>
      Hello World
    </span>
  );
};

export default MyComponent;
