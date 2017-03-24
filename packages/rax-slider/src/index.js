import {Component, createElement, PropTypes} from 'rax';
import {isWeex} from 'universal-env';

let Slide;
if (!isWeex) {
  Slide = require('./slider.web');
}

class Slider extends Component {
  state = {
    index: this.props.index || 0
  }

  static defaultProps = {
    onChange: () => {},
    defaultPaginationStyle: defaultPaginationStyle
  }

  onChange = (e) => {
    this.props.onChange(e);
  }

  handleNativeProps() {
    const {
      defaultPaginationStyle,
      autoPlay,
      showsPagination,
      paginationStyle,
      autoPlayInterval,
      width,
      height
    } = this.props;

    const {index} = this.state;

    let nativeProps = {
      onchange: this.onChange,
      autoPlay: autoPlay,
      showIndicators: showsPagination,
      paginationStyle: paginationStyle ? paginationStyle : defaultPaginationStyle,
      interval: autoPlayInterval,
      index: index,
      ...{
        style: {
          width: width,
          height: height,
          ...this.props.style
        }
      }
    };

    return nativeProps;
  }

  render() {
    if (isWeex) {
      const children = this.props.children;
      const nativeProps = this.handleNativeProps();
      return (
        <slider {...nativeProps}>
          {nativeProps.showIndicators ?
            <indicator style={nativeProps.paginationStyle} /> :
            null}
          {children}
        </slider>
      );
    } else {
      return <Slide ref="Slider" {...this.props} />;
    }
  }

  slideTo(index) {
    if (isWeex) {
      this.setState({
        index: index
      });
    } else {
      this.props.onChange({
        index: index
      });
      this.refs.Slider.slideTo(index);
    }
  }
}

const defaultPaginationStyle = {
  position: 'absolute',
  width: 750,
  height: 40,
  bottom: 20,
  left: 0,
  itemColor: 'rgba(255, 255, 255, 0.5)',
  itemSelectedColor: 'rgb(255, 80, 0)',
  itemSize: 8
};

export default Slider;
