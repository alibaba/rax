import { createElement } from 'rax';
import { isWeex } from 'universal-env';
import { Props } from './types';
import WeexComponent from './weex';
import WebComponent from './web';

export default (props: Props) => {
  if (isWeex) {
    return <WeexComponent {...props} />;
  } else {
    return <WebComponent {...props} />;
  }
};
