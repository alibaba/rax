import {createElement, Component, render} from 'universal-rx';
import StyleSheet from 'universal-stylesheet';
import PanResponder from 'universal-panresponder';
import Animated from 'rx-animated';
import {Text, View, Image} from 'rx-components';

var width = 560;
var height = 300;

function calculatePercentage(offset, dimension) {
  return -2 / dimension * offset + 1;
}

class App extends Component {
  state = {
    maxRotation: 12,
    maxTranslation: 6,
    perspective: 800,
  };

  componentWillMount() {
    this._animations = {
      xRotationPercentage: new Animated.Value(0),
      yRotationPercentage: new Animated.Value(0),
      xTranslationPercentage: new Animated.Value(0),
      yTranslationPercentage: new Animated.Value(0)
    };

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderMove: (e, gestureState) => {
        var {
          pageX: x,
          pageY: y
        } = e.changedTouches[0];

        this._animations.xRotationPercentage.setValue(calculatePercentage(y, height));
        this._animations.yRotationPercentage.setValue(calculatePercentage(x, width) * -1);
        this._animations.xTranslationPercentage.setValue(calculatePercentage(x, width));
        this._animations.yTranslationPercentage.setValue(calculatePercentage(y, height));
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{width: width, height: height}} {...this._panResponder.panHandlers}>
          <Card
              style={{backgroundColor: '#DDDEDE', borderRadius: 10, width: width, height: height}}
              stackingFactor={1}
              {...this.state}
              {...this._animations}
          >
            <Card
              style={{backgroundColor: '#5F5D60', borderRadius: 400, position: 'absolute', top: 30, left: 160, width: 240, height: 240}}
              stackingFactor={1.4}
              {...this.state}
              {...this._animations}
            >
              <Card
                style={{position: 'absolute', top: 58, left: 56, width: 126, height: 126}}
                stackingFactor={1.8}
                {...this.state}
                {...this._animations}
              >
                <Image style={{width: 126, height: 126}} source={{uri: 'http://ata2-img.cn-hangzhou.img-pub.aliyun-inc.com/2ac8c5148d6c9c40c4e63535b1904f4a'}} />
              </Card>

              <Image style={{position: 'absolute', top: 22, left: 20, width: 200, height: 200}} source={{uri: 'http://ata2-img.cn-hangzhou.img-pub.aliyun-inc.com/20498acf40d03cf48f7555aafef53a8f'}} />
            </Card>
          </Card>
        </View>
      </View>
    );
  }
}

class Card extends Component {
  componentWillMount() {
    var translateMax = this.props.maxTranslation * this.props.stackingFactor;
    var rotateMax = this.props.maxRotation;

    this._xRotation = this.props.xRotationPercentage.interpolate({
      inputRange: [-1, 1],
      outputRange: [ rotateMax * -1 + 'deg', rotateMax + 'deg'],
      extrapolate: 'clamp'
    });

    this._yRotation = this.props.yRotationPercentage.interpolate({
      inputRange: [-1, 1],
      outputRange: [ rotateMax * -1 + 'deg', rotateMax + 'deg'],
      extrapolate: 'clamp'
    });

    this._translateX = this.props.xTranslationPercentage.interpolate({
      inputRange: [-1, 1],
      outputRange: [translateMax * -1, translateMax],
      extrapolate: 'clamp'
    });

    this._translateY = this.props.yTranslationPercentage.interpolate({
      inputRange: [-1, 1],
      outputRange: [translateMax * -1, translateMax],
      extrapolate: 'clamp'
    });
  }

  getTransform() {
    return [
      {perspective: this.props.perspective},
      {rotateX: this._xRotation},
      {rotateY: this._yRotation},
      {translateX: this._translateX},
      {translateY: this._translateY},
    ];
  }

  render() {
    return (
      <Animated.View
        {...this.props}
        style={[this.props.style, {transform: this.getTransform()}]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5F5D60'
  }
});

render(<App />);
