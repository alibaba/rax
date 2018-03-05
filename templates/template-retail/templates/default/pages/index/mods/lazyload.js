import { createElement, Component, PropTypes, findDOMNode } from 'rax';
import { Image, View } from 'rax-components';
import { isWeex } from 'universal-env';
import transition from 'universal-transition';

export default class LazyLoad extends Component {
  static defaultProps = {
    placeholder: 'https://cbu01.alicdn.com/cms/upload/2017/107/213/3312701_38443169.png',
    source: {uri: ''}
  }

  static propTypes = {
    placeholder: PropTypes.string,
    source: PropTypes.object,
    style: PropTypes.object,
    placeholderStyle: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false
    };
    this.onAppear = this.onAppear.bind(this);
    this.loadAnimate = this.loadAnimate.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.visible !== nextState.visible;
  }

  onAppear() {
    this.setState({
      visible: true
    });
  }

  // 仅支持weex，web直接opacity:1
  loadAnimate() {
    transition(findDOMNode(this.imageRef), {
      opacity: 1
    }, {
      timingFunction: 'ease-in-out',
      delay: 0,
      duration: 300
    });
  }

  render() {
    const {source, style, placeholder, placeholderStyle, ...others} = this.props;
    let url = source.uri;
    const placeStyle = {
      width: 100,
      height: 100,
      ...placeholderStyle
    };
    const visible = this.state.visible;
    if (!visible) {
      url = placeholder;
    }

    return (
      <View style={{position: 'relative', width: style.width, height: style.height}} onAppear={this.onAppear} >
        <Image
          source={{uri: url}}
          style={[style, {
            opacity: visible && isWeex ? 0 : 1
          }]}
          onLoad={() => {
            if (url === placeholder) return;
            this.loadAnimate();
          }}
          ref={ref => this.imageRef = ref}
          {...others} />
        {
          visible ? null :
            <View style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: style.width,
              height: style.height,
              backgroundColor: '#fff'
            }}>
              <Image source={{uri: placeholder}} style={{
                position: 'absolute',
                left: (style.width - placeStyle.width) / 2,
                top: (style.height - placeStyle.height) / 2,
                ...placeStyle
              }} />
            </View>
        }
      </View>
    );
  }
}