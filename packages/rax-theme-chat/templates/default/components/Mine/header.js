import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Touchable from 'rax-touchable';
import styles from './mine.css';

export default class MineHeader extends Component {

  render() {
    return (
      <Touchable onPress={() => {
        alert('hello world');
      }}>
        <View style={[styles.item]}>
          <Image
            style={[styles.img]}
            source={{uri: 'https://gw.alicdn.com/tfs/TB1g6AvPVXXXXa7XpXXXXXXXXXX-215-215.png'}}
          />
          <View style={{justifyContent: 'center'}}>
            <Text style={styles.text}>Rax</Text>
            <Text style={{marginTop: 16, fontSize: 28}}>微信号:  TaobaoFED</Text>
          </View>
          <View style={{flex: 1}} />
          <View style={{flexDirection: 'row'}}>
            <Image
              source={{uri: require('../../images/me_qr.png')}}
              style={styles.qrImg}
            />
            <Image
              source={{uri: require('../../images/forward.png')}}
              style={styles.forward}
            />
          </View>
        </View>
      </Touchable>
    );
  }
}
