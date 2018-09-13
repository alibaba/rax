import {createElement, Component} from 'rax';
import Text from 'rax-text';
import View from 'rax-view';
import Image from 'rax-image';
import GyroscopeParallax from 'rax-gyroscope-parallax';
import Picture from 'rax-picture';


const styles = {
  container: {
    width: 750,
    height: 1000
  },
  logo: {
    position: 'absolute',
    top: 500,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  rope1: {
    position: 'absolute',
    width: 750,
    height: 50,
    left: 0,
    top: 160
  },
  rope2: {
    position: 'absolute',
    width: 750,
    height: 50,
    left: 0,
    top: 260
  },
  block1: {
    width: 200,
    height: 200,
    left: 275,
    top: 200,
    position: 'absolute'
  },
  block2: {
    width: 100,
    height: 100,
    left: 500,
    top: 190,
    position: 'absolute',

  },
  block3: {
    width: 80,
    height: 80,
    left: 180,
    top: 290,
    position: 'absolute',
  },
  block4: {
    width: 220,
    height: 220,
    left: 480,
    top: 280,
    position: 'absolute'
  },
  birds: {
    width: 120,
    height: 120,
    left: 100,
    top: 180,
    position: 'absolute'
  },
  lighthouse: {
    width: 300,
    height: 450,
    left: 400,
    bottom: 160,
    position: 'absolute'
  },
  wave0: {
    width: 750,
    height: 120,
    bottom: 140
  },
  wave1: {
    width: 750,
    height: 150,
    bottom: 80
  },
  wave2: {
    width: 750,
    height: 200,
    bottom: 10
  },
  wave3: {
    width: 750,
    height: 200,
    bottom: -80
  }
};


const images = {
  background: '//img.alicdn.com/tfs/TB1GW.3XGagSKJjy0FgXXcRqFXa-2080-1100.png',
  cloud: '//img.alicdn.com/tfs/TB1_DqdXfxNTKJjy0FjXXX6yVXa-280-280.png',
  cloud2: '//img.alicdn.com/tfs/TB1qLI3XGagSKJjy0FgXXcRqFXa-280-280.png',
  birds: '//img.alicdn.com/tfs/TB1OUI0XGagSKJjy0FbXXa.mVXa-280-280.png',
  rope: '//img.alicdn.com/tfs/TB1YRI3XGigSKJjSsppXXabnpXa-1600-200.png',
  lighthouse: '//img.alicdn.com/tfs/TB1YBucd3MPMeJjy1XdXXasrXXa-320-560.png',
  wave: '//img.alicdn.com/tfs/TB1Rmmcd3MPMeJjy1XdXXasrXXa-800-320.png'
};

class Demo extends Component {
  state = {
    isShow: false
  }


  componentDidMount() {
    setTimeout(() => {
      this.setState({isShow: true});
    }, 200);
  }


  render() {
    return (

      <GyroscopeParallax
        calibrationThreshold={50}
        style={[styles.container, {opacity: this.state.isShow ? 1 : 0}]}>
        <View style={{width: 750, position: 'absolute', bottom: 0, top: 0}}>
          <Image resizeMode="cover" source={{uri: images.background}} style={{width: 2500, left: -825, position: 'absolute', bottom: 0, top: -100}} />
        </View>
        <GyroscopeParallax.Layer depthX={1} depthY={2} style={styles.rope1}>
          <Picture resizeMode="cover" style={{width: 750, height: 50}} source={{uri: images.rope}} />
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={1} depthY={3} style={styles.rope2}>
          <Picture resizeMode="cover" style={{width: 750, height: 50}} source={{uri: images.rope}} />
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={1} depthY={2} style={styles.birds}>
          <Picture resizeMode="cover" style={{width: 200, height: 200, marginLeft: -60}} source={{uri: images.birds}} />
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={.8} depthY={2} style={styles.block1}>
          <Picture style={{width: 200, height: 200}} source={{uri: images.cloud}} />
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={1.4} depthY={2} style={styles.block2}>
          <Picture style={{width: 100, height: 100}} source={{uri: images.cloud2}} />
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={1.6} depthY={3} style={styles.block3}>
          <Picture style={{width: 80, height: 80}} source={{uri: images.cloud2}} />
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={2} depthY={3} style={styles.block4}>
          <Picture style={{width: 220, height: 220}} source={{uri: images.cloud}} />
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={.2} depthY={.2} style={styles.lighthouse}>
          <Picture style={{width: 300, height: 450}} source={{uri: images.lighthouse}} />
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={.2} depthY={.4} style={styles.wave0}>
          <Picture style={{width: 1300, height: 200, marginLeft: -200}} source={{uri: images.wave}} />
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={1} depthY={.8} style={styles.wave1}>
          <Picture style={{width: 1500, height: 200, marginLeft: -400}} source={{uri: images.wave}} />
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={2} depthY={1} style={styles.wave2}>
          <Picture style={{width: 1500, height: 200, marginLeft: -200}} source={{uri: images.wave}} />
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={3} depthY={1.2} style={styles.wave3}>
          <Picture style={{width: 1500, height: 200, marginLeft: -400}} source={{uri: images.wave}} />
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer invertX={true} invertY={true} depthX={1} depthY={1} style={styles.logo}>
          <Text style={{color: '#fff', backgroundColor: 'rgba(0,0,0,0)', fontSize: 90, textAlign: 'center', width: 750}}>Binding</Text>
        </GyroscopeParallax.Layer>
      </GyroscopeParallax>


    );
  }
}

export default Demo;


