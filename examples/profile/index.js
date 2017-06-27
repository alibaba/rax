import {createElement, Component, render} from 'rax';
import StyleSheet from 'universal-stylesheet';
import Platform from 'universal-platform';
import Animated from 'rax-animated';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import TouchableOpacity from 'rax-touchable';
import {isWeb} from 'universal-env';

const PROFILE_WIDTH = 90;

class App extends Component {

  state = {
    scrollY: new Animated.Value(0),
  };

  _blockJS = () => {
    const start = Date.now();
    setTimeout(() => {
      while (Date.now() - start < 5000) {}
    }, 1);
  }

  _renderContent() {
    return Array.from({ length: 30 }).map((_, i) =>
      <TouchableOpacity key={i} style={styles.row} onPress={this._blockJS}>
        <Text>{i}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_HEIGHT - NAVBAR_HEIGHT],
      outputRange: [1, 0],
    });
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, 200],
      outputRange: [0, 100],
    });
    const imageScale = this.state.scrollY.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: [2.5, 1, 1],
      extrapolate: 'clamp',
    });
    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, 200],
      outputRange: [-1, -200],
    });
    const navBarBackgroundOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_HEIGHT - NAVBAR_HEIGHT - 1, HEADER_HEIGHT - NAVBAR_HEIGHT],
      outputRange: [0, 0, 1],
    });
    const profileTranslateY = this.state.scrollY.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [1, 0, -0.8],
    });
    const profileTranslateX = this.state.scrollY.interpolate({
      inputRange: [-1, 0, 150, 151],
      outputRange: [0, 0, -PROFILE_WIDTH / 8, -PROFILE_WIDTH / 8],
    });
    const profileScale = this.state.scrollY.interpolate({
      inputRange: [-1, 0, 150, 151],
      outputRange: [1, 1, 0.6, 0.6],
      extrapolate: 'clamp',
    });
    const titleOpacity = this.state.scrollY.interpolate({
      inputRange: [0, 220, 250],
      outputRange: [0, 0, 1],
    });
    const titleTranslate = this.state.scrollY.interpolate({
      inputRange: [-1, 0, 220, 250, 251],
      outputRange: [20, 20, 20, 0, 0],
      extrapolate: 'clamp',
    });

    let scrollHandler;
    if (isWeb) {
      scrollHandler = Animated.event(
        [{ target: { scrollTop: this.state.scrollY } }],
        { useNativeDriver: true }
      );
    }

    return (
      <View style={[{flex: 1}, StyleSheet.absoluteFill]}>
        <View style={[styles.fill, { overflow: 'hidden' }]}>
          <Animated.ScrollView
            scrollEventThrottle={16}
            style={styles.fill}
            contentContainerStyle={styles.content}
            onScroll={scrollHandler}
          >
            <Text style={styles.name}>Profile</Text>
            {this._renderContent()}
          </Animated.ScrollView>

          <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslate }] }]} pointerEvents="none">
            <Animated.Image
              style={[styles.image, { opacity: imageOpacity, transform: [{ translateY: imageTranslate }, { scale: imageScale } ] }]}
              resizeMode="cover"
              source={{ uri: '//img.alicdn.com/imgextra/i3/2950662430/TB2J3uvX9CI.eBjy1XbXXbUBFXa_!!2-jiyoujia.png' }}
            />
          </Animated.View>

          <Animated.View style={[
            styles.profile,
            { transform: [{ translateY: profileTranslateY }, { translateX: profileTranslateX }, { scale: profileScale }] }
          ]}>
            <Image
              resizeMode="cover"
              style={styles.profileImage}
              source={{uri: '//img.alicdn.com/imgextra/i3/2950662430/TB2J3uvX9CI.eBjy1XbXXbUBFXa_!!2-jiyoujia.png'}}
            />
          </Animated.View>

          <View style={styles.navbar}>
            <Animated.View style={[styles.navbarBackground, { opacity: navBarBackgroundOpacity }]} />

            <View style={[StyleSheet.absoluteFill, {flexDirection: 'row', alignItems: 'center'}]}>
              <TouchableOpacity onPress={() => {
                this.props.navigator.pop();
              }} hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}>
                <Image
                  style={styles.backButton}
                  source={{ uri: 'https://www.android.com/static/img/map/back-arrow.png' }}
                />
              </TouchableOpacity>

              <Animated.View pointerEvents="none" style={[styles.titleContainer, {opacity: titleOpacity, transform: [{ translateY: titleTranslate }] }]}>
                <Text style={styles.title}>
                  Profile
                </Text>
              </Animated.View>

              <View style={styles.rightButton} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const HEADER_HEIGHT = 200;
const NAVBAR_HEIGHT = 56;

const styles = StyleSheet.create({
  row: {
    padding: 10,
    margin: 10,
    backgroundColor: '#eeeeee',
  },
  fill: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  image: {
    height: HEADER_HEIGHT,
  },
  header: {
    overflow: 'hidden',
    position: 'absolute',
    top: -HEADER_HEIGHT - HEADER_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor: '#443f38',
    height: HEADER_HEIGHT + HEADER_HEIGHT + HEADER_HEIGHT,
    paddingTop: HEADER_HEIGHT + HEADER_HEIGHT,
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: NAVBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navbarBackground: {
    backgroundColor: '#443f38',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  profile: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 8,
    position: 'absolute',
    top: HEADER_HEIGHT - 50,
    left: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: PROFILE_WIDTH,
    height: PROFILE_WIDTH,
  },
  content: {
    backgroundColor: '#ffffff',
    paddingTop: HEADER_HEIGHT,
  },
  name: {
    backgroundColor: 'transparent',
    marginTop: 60,
    marginBottom: 16,
    marginLeft: 16,
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButton: {
    width: 20,
    height: 20,
    marginLeft: 16,
    tintColor: 'white',
  },
  rightButton: {
    width: 20,
    height: 20,
    marginRight: 16,
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
});

render(<App />);
