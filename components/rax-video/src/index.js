import {Component, createElement} from 'rax';
import {isWeex, isWeb} from 'universal-env';

const PLAY = 'play';
const PAUSE = 'pause';

class Video extends Component {
  render() {
    let props = this.props;

    if (isWeex) {
      props.playStatus = props.playControl;
      return <video {...props} />;
    } else {
      let nativeProps = {
        ...props
      };

      delete nativeProps.autoPlay;
      delete nativeProps.src;

      if (props.autoPlay || props.playControl === PLAY) {
        nativeProps.autoPlay = props.autoPlay;
      }
      // Default controls is true
      if (props.controls == null || props.controls === true) {
        nativeProps.controls = true;
      } else {
        delete nativeProps.controls;
      }

      let node = this.refs.video;
      if (node) {
        if (props.playControl === PAUSE) {
          node.pause();
        } else if (props.playControl === PLAY) {
          node.play();
        }
      }

      return <video
        ref="video"
        {...nativeProps}
        webkit-playsinline
        playsinline>
        <source src={props.src} />
      </video>;
    }
  }
}

export default Video;
