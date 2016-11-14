import {Component, createElement} from 'universal-rx';
import {isWeex} from 'universal-env';

class Video extends Component {
  render() {
    let props = this.props;

    if (isWeex) {
      return <video {...props} />;
    } else {
      let nativeProps = {
        ...props,
        controls: true,
      };

      delete nativeProps.autoPlay;
      delete nativeProps.src;

      if (props.autoPlay) {
        nativeProps.autoPlay = props.autoPlay;
      }
      let src = props.src;

      return <video
        {...nativeProps}
        webkit-playsinline>
        <source src={src} />
      </video>;
    }
  }
}

export default Video;
