/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule Slider
 */
import {Component, createElement} from 'rax';
import {isWeex, isWeb} from 'universal-env';

let Slide;
if (isWeb) {
  Slide = require('./SliderForWeb');
}

export default class Slider extends Component {
  state = {
    index: this.props.index || 0
  }

  static defaultProps = {
    onChange: () => {},
    defaultPaginationStyle: defaultPaginationStyle
  }

  onChange = (e) => {
    this.props.onChange(e);
    // TODO:weex安卓下setIndex有bug 兼容初始化index
    // this.setState({
    //   index: e.index
    // });
  }

  handleNativeProps() {
    // 兼容API标准
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
  width: '750rem',
  height: '40rem',
  bottom: '20rem',
  left: 0,
  itemColor: 'rgba(255, 255, 255, 0.5)',
  itemSelectedColor: 'rgb(255, 80, 0)',
  itemSize: '8rem'
};