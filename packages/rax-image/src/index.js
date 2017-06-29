import {Component, createElement, PropTypes} from 'rax';
import {isWeex} from 'universal-env';
import View from 'rax-view';

class Image extends Component {

  static propTypes = {};

  static resizeMode = {
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
    center: 'center',
    repeat: 'repeat',
  };

  static contextTypes = {
    isInAParentText: PropTypes.bool
  };

  render() {
    let nativeProps = {
      ...this.props,
    };
    let source = nativeProps.source;

    // Source must a object
    if (source && source.uri) {
      let style = nativeProps.style;
      let {width, height, uri} = source;

      // Default is 0
      if (
        width == null &&
        height == null &&
        style.height == null &&
        style.width == null
      ) {
        width = 0;
        height = 0;
      }

      nativeProps.style = {
        ...{
          ...!this.context.isInAParentText && {display: 'flex'},
          width: width,
          height: height,
        },
        ...style
      };
      nativeProps.src = uri;

      delete nativeProps.source;

      let NativeImage;
      if (isWeex) {
        NativeImage = 'image';
      } else {
        NativeImage = 'img';
      }

      // for cover and contain
      let resizeMode = nativeProps.resizeMode || nativeProps.style.resizeMode;
      if (resizeMode) {
        if (isWeex) {
          nativeProps.resize = resizeMode;
          nativeProps.style.resizeMode = resizeMode;
        } else {
          nativeProps.style.objectFit = resizeMode;
        }
      }

      if (this.props.children) {
        nativeProps.children = null;
        return (
          <View style={nativeProps.style}>
            <NativeImage {...nativeProps} />
            <View style={styles.absoluteImage}>
              {this.props.children}
            </View>
          </View>
        );
      } else {
        return <NativeImage {...nativeProps} />;
      }
    }
    return null;
  }
}

var styles = {
  absoluteImage: {
    left: 0,
    top: 0,
    position: 'absolute'
  }
};

export default Image;
