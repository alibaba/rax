import {createElement} from 'rax';
import {Text} from 'rax-components';
import normalize from './normalizeText';

const TextElement = ({style, children, h1, h2, h3, h4, h5, h6, fontFamily}) =>
  <Text
    style={[
      h1 && {fontSize: normalize(40)},
      h2 && {fontSize: normalize(34)},
      h3 && {fontSize: normalize(28)},
      h4 && {fontSize: normalize(22)},
      fontFamily && {fontFamily},
      style && style
    ]}>{children}</Text>
;

export default TextElement;
