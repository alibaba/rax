import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';
import TextInput from 'rax-textinput';
import Button from 'rax-button';
import Switch from 'rax-switch';
import Video from 'rax-video';
import ScrollView from 'rax-scrollview';
import TouchableWithoutFeedback from 'rax-touchable';
import Gotop from 'rax-gotop';

class GotopDemo extends Component {
  render() {
    return (
      <View>
        <Gotop resident={true} bottom={40} onTop={() => {
          this.props.onTop();
        }} />
        <View style={styles.container}>
          <Image style={styles.icon} source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABCCAYAAAAL1LXDAAAClElEQVR42u3YS4vTUBQH8PgWdK8rty5dCy79For3Jt5761R7z52xI7rLB3AhLoTRcXwMKlYUH/gAd25duXYp6AeYjYJOzR+EQO1JaKNtmpw/hLYntzS/np40beQcHVHWv1eGfijjh03cYIMR1gh3UGzDBivAWy0Cb7Wuw+2bYYlEIpEwGQ6HO5Tzl5T1X7Tx37QN13Sa7m8u1vi10a8Mbekd0G3A5mjj3/Z61/c1Bqst3Sy/CqI3QDcSy3eaXqdpureZWL7Tr4BexJm9VYrjZ/ol0M3E8p1+4dzankX4GK/zEPo8pvYxu/05ttPWPwd6IbHa0Kp2If2rjpoNp7SlX0ynnwG9cFis48DYF3foNNDM859mM727Rlh/uwxbBkYSQ2f4TvsnQNcaG9vQx7pycJ7YecWhs/pgbujshXcqQxtl2EnBSNzxcUGnHw8Gg121wipHF7FuWjCibUiy/dtMpx8BPTOstnSnDFsVjChDZzm0svQQ6LlitQ0rWFcNPNppsmynDT0AukbY6mAkW+fYThvaxLH9e6wJdzls7GgZ66qCizvtz/Ez7e/n6Fpgq4OR2IUl7jhwjDm6AlZZuleGnRUYUSacZ9HZyFVCa0eXC97RgDWzBOedpgsFP1A2cEE0FVgZ+lSEnRcYUY58QafXp0LjH8UxJwjCvnmDERwLO26GrkaTJumsHMP/x3+g33GmRL0uYATnEQa9rburh6NJ0+2mB5NOOG6IDuFx3cAIru7GoZMlOhpVSV3BCH6sjIzeB8xxY8FIYpdPKkM38O3S7/cPoNZAMB8BC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWcLvBsQ1XRsGoNRacODoxCkYtanK0DT1l6Ss23I8k/ze/AcSDH16N8PnHAAAAAElFTkSuQmCC'}} />
          <Text>
            Look at the floating icon in the lower right corner of the page
          </Text>
        </View>
      </View>
    );
  }
}

let styles = {
  container: {
    padding: 20,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 16,
  },
};

export default GotopDemo;
