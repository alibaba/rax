import { createElement } from 'rax';
import { push } from '@core/router';
import Panel from '../../components/Panel';
import Text from 'rax-text';
import View from 'rax-view';

export default () => {
  return (
    <View>
      <Text>Hello Rax</Text>
      <Panel>
        <Text>Go to https://rax.js.org see more information</Text>
      </Panel>
      <View onClick={() => push('/')}>
        <Text>Go home</Text>
      </View>
    </View>
  );
};
