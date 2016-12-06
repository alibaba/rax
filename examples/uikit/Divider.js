import {createElement} from 'rax';
import {View} from 'rax-components';
import StyleSheet from 'universal-stylesheet';
import colors from './colors';

function Divider({style}) {
  return (
    <View style={[styles.container, style]} />
  );
}

const styles = StyleSheet.create({
  container: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.grey5
  }
});

export default Divider;
