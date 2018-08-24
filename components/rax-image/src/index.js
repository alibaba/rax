import { PureComponent, createElement, PropTypes } from 'rax';
import { isWeex } from 'universal-env';
import View from 'rax-view';

class Image extends PureComponent {
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

  static defaultProps = {
    onLoad() {},
    onError() {},
    fallbackSource: {},
  };

  state = {
    source: this.props.source,
  };

  onLoad = e => {
    const { onError } = this;
    const { onLoad } = this.props;

    if (typeof e.success !== 'undefined') {
      if (e.success) onLoad(e); else onError(e);
    } else if (typeof e.currentTarget !== 'undefined') {
      if (e.currentTarget.naturalWidth > 1 && e.currentTarget.naturalHeight > 1) {
        onLoad(e);
      } else {
        onError(e);
      }
    }
  };

  onError = e => {
    const { fallbackSource, onError } = this.props;
    const { source } = this.state;

    if (fallbackSource.uri && source.uri !== fallbackSource.uri) {
      this.isError = true;
      this.setState({
        source: fallbackSource,
      });
    }
    onError(e);
  };

  save = (callback) => {
    this.refs.nativeImg.save(result => {
      callback(result);
    });
  }

  render() {
    let nativeProps = {
      ...this.props,
    };
    let source = this.isError ? this.state.source : nativeProps.source;

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
      nativeProps.onLoad = this.onLoad;
      nativeProps.onError = this.onError;

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
            <NativeImage ref={'nativeImg'} {...nativeProps} />
            <View style={styles.absoluteImage}>
              {this.props.children}
            </View>
          </View>
        );
      } else {
        return <NativeImage ref={'nativeImg'} {...nativeProps} />;
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
