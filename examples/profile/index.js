import {createElement, Component, render} from 'universal-rx';
import StyleSheet from 'universal-stylesheet';
import Platform from 'universal-platform';
import Animated from 'rx-animated';
import {Text, TouchableOpacity, View, Image} from 'rx-components';

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
      outputRange: [0, 0, -PROFILE_WIDTH/8, -PROFILE_WIDTH/8],
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
      inputRange:  [-1,  0, 220, 250, 251],
      outputRange: [20, 20,  20,   0,   0],
      extrapolate: 'clamp',
    });
    return (
      <View style={{flex: 1}}>
        <View style={{height: Platform.OS === 'android' ? 24 : 26, position: 'absolute', top: 0, left: 0, right:0, backgroundColor: 'black'}} />
        <View style={[styles.fill, { overflow: 'hidden' }]}>
          <Animated.ScrollView
            scrollEventThrottle={16}
            style={styles.fill}
            contentContainerStyle={styles.content}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              { useNativeDriver: true }
            )}
          >
            <Text style={styles.name}>Doogy</Text>
            {this._renderContent()}
          </Animated.ScrollView>

          <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslate }] }]} pointerEvents="none">
            <Animated.Image
              style={[styles.image, { opacity: imageOpacity, transform: [{ translateY: imageTranslate }, { scale: imageScale } ] }]}
              resizeMode="cover"
              source={{ uri: 'http://vignette4.wikia.nocookie.net/happypasta/images/6/6c/Anime-kittens-cats-praying-496315.jpg/revision/latest?cb=20130914024839' }}
            />
          </Animated.View>

          <Animated.View style={[
            styles.profile,
            { transform: [{ translateY: profileTranslateY }, { translateX: profileTranslateX }, { scale: profileScale }] }
          ]}>
            <Image
              resizeMode="cover"
              style={styles.profileImage}
              source={{uri: 'http://favim.com/orig/201106/14/adorable-cute-lab-love-puppy-puppy-face-Favim.com-75572.jpg'}}
            />
          </Animated.View>

          <View style={styles.navbar}>
            <Animated.View style={[styles.navbarBackground, { opacity: navBarBackgroundOpacity }]} />

            <View style={[StyleSheet.absoluteFill, {flexDirection: 'row', alignItems: 'center'}]}>
              <TouchableOpacity onPress={() => { this.props.navigator.pop() }} hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}>
                <Image
                  style={styles.backButton}
                  source={{ uri: 'https://www.android.com/static/img/map/back-arrow.png' }}
                />
              </TouchableOpacity>

              <Animated.View pointerEvents="none" style={[styles.titleContainer, {opacity: titleOpacity, transform: [{ translateY: titleTranslate }] }]}>
                <Text style={styles.title}>
                  Doogy
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

const HEADER_HEIGHT = 150;
const NAVBAR_HEIGHT = 56;

const styles = StyleSheet.create({
  row: {
    padding: 10,
    margin: 10,
    backgroundColor: '#eee',
  },
  fill: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'android' ? 24 : 26,
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
    backgroundColor: '#008ca6',
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
    backgroundColor: '#008ca6',
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
    top: HEADER_HEIGHT - 30,
    left: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: PROFILE_WIDTH,
    height: PROFILE_WIDTH,
  },
  content: {
    backgroundColor: '#fff',
    paddingTop: HEADER_HEIGHT,
  },
  name: {
    backgroundColor: 'transparent',
    marginTop: 60,
    marginBottom: 16,
    marginLeft: 10,
    fontSize: 16,
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

render(<App />, document.body);
