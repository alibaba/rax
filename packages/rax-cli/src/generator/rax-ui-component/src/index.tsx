import { useStyles } from '@rax-ui/styles';
import View from 'rax-view';
import Text from 'rax-text';
import StyleProvider from './style';

export interface HelloProps {
  message?: string;
}

const Hello = ({ message = 'hello world', ...others }: HelloProps) => {

  const styles = useStyles(StyleProvider, others, (classNames) => {
    return {
      hello: classNames('hello')
    };
  });

  return (
    <View {...others}>
      <Text style={styles.hello}>{message}</Text>
    </View>
  );
}

export default Hello;
