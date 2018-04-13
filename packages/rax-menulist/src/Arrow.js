import {createElement, Component} from 'rax';
import Image from 'rax-image';
import StyleSheet from 'universal-stylesheet';

export default class Arrow extends Component {
  constructor(props) {
    super(props);
    const {style = arrowStyle.arrowIcon, containerWidth} = this.props;
    const {width} = style;
    this.position = {
      top: {
        top: - width,
        transform: 'rotateX(180deg)'
      },
      bottom: {
        bottom: - width
      },
      left: {
        left: 15
      },
      middle: {
        left: containerWidth / 2,
        marginLeft: - (width / 2)
      },
      right: {
        right: 15
      }
    };
  }

  render() {
    const {
      source,
      arrowPosition = {x: 'middle', y: 'bottom'},
      style = arrowStyle.arrowIcon
    } = this.props;
    const {x, y} = arrowPosition;
    const positionStyle = [this.position[x], this.position[y]];

    return (
      <Image source={source} style={[style, positionStyle]} />
    );
  }
}

const arrowStyle = StyleSheet.create({
  arrowIcon: {
    width: 18,
    height: 18,
    position: 'absolute'
  }
});
