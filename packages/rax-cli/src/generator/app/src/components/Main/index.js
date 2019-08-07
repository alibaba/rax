import styles from './index.css';
import { createElement } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';

export default (props) => {
  return (
    <View style={styles.home}>
      <Image
        style={styles.logo}
        source={{
          uri: '//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png',
        }}
      />
      <Text style={styles.title}>Welcome to Your Rax App</Text>

      <Text style={styles.info}>More information about Rax</Text>
      <Text style={styles.info}>Visit https://rax.js.org</Text>
    </View>
  );
};
