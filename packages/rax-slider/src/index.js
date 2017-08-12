import {Component, createElement, PropTypes} from 'rax';
import {isWeex, isWeb} from 'universal-env';

let SliderWeb;
if (isWeb) {
  SliderWeb = require('./slider.web');
}

class Slider extends Component {

  static propTypes = {

    /**
     * Slider的宽度（必填）
     */
    width: PropTypes.string.isRequired,

    /**
     * Slider的高度（必填）
     */
    height: PropTypes.string.isRequired,

    /**
     * Slider是否自动播放
     */
    autoPlay: PropTypes.bool,

    /**
     * 是否显示分页的小圆点点
     */
    showsPagination: PropTypes.bool,

    /**
     * 自己定义小圆点点的样式，否则默认样式居中
     */
    paginationStyle: PropTypes.object,

    /**
     * 是否是循环播放（web）
     */
    loop: PropTypes.bool,

    /**
     * 指定默认初始化第几个（在weex安卓下有兼容问题，需要节点渲染完成后异步调用，暂不推荐使用）
     */
    index: PropTypes.number,

    /**
     * 自动播放的间隔时间
     */
    autoPlayInterval: PropTypes.number

  };

  static defaultProps = {
    onChange: () => { },
    defaultPaginationStyle: defaultPaginationStyle
  }

  state = {
    index: this.props.index || 0
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
      loop,
      width,
      height
    } = this.props;

    const {index} = this.state;

    let nativeProps = {
      onChange: this.onChange,
      autoPlay: autoPlay,
      showIndicators: showsPagination,
      paginationStyle: paginationStyle ? paginationStyle : defaultPaginationStyle,
      interval: autoPlayInterval,
      infinite: loop,
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

  slideTo(index) {
    if (isWeex) {
      this.setState({
        index: index
      });
    } else {
      this.refs.slider.slideTo(index);
    }
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
      return <SliderWeb ref="slider" {...this.props} />;
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
