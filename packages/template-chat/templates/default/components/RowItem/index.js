import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import styles from './style.css';

export default class RowItem extends Component {

  render() {
    const { title, icon } = this.props;
    return (
      <View style={[styles.item]}>
        <Image
          style={[styles.img]}
          source={icon}
        />
        <View>
          <Text style={styles.text}>{title}</Text>
        </View>
        <View style={{flex: 1}} />
        <View>
          <Image
            source={{ uri: require('../../images/forward.png') }}
            style={styles.forward}
          />
        </View>
      </View>
    );
  }
}
