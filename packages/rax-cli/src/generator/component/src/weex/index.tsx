import { createElement } from 'rax';
import { Props } from '../types';

const MyComponent = (props: Props) => {
  return <text {...props} >Hello World</text>;
};

export default MyComponent;
