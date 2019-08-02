import { createElement } from 'rax';
import { push } from '@core/router';
import Site from '../../components/Site';
import Text from 'rax-text';
import View from 'rax-view';

export default () => {
  return (
    <View>
      <Text>Hello Rax</Text>
      <Site />
      <View onClick={() => push('/')}>
        <Text>Go home</Text>
      </View>
    </View>
  );
};
