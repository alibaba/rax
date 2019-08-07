import styles from './index.css';
import { createElement } from 'rax';
import Image from 'rax-image';

export default (props) => {
  return (
    <Image
      style={styles.logo}
      source={{
        uri: '//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png',
      }}
    />
  );
};
