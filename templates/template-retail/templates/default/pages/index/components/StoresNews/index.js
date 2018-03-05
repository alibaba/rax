import { createElement, Component, findDOMNode, setNativeProps, PropTypes } from 'rax';
import { View, Text, Image, RecyclerView } from 'rax-components';
import transition from 'universal-transition';
import { isWeex } from 'universal-env';
import { getWebPx } from '../../mods/util';
import OpenUrl from '../../mods/openUrl';
import style from './style';

export default class StoresNews extends Component {
  static propTypes = {
    sourceData: PropTypes.array
  }

  static defaultProps = {
    sourceData: []
  }

  constructor(props, context) {
    super(props, context);
    this.curr = 0;
    this.itemHeight = 46;
    this.startInterval = this.startInterval.bind(this);
    this.stopInterval = this.stopInterval.bind(this);
  }

  componentDidMount() {
    this.timmer = setInterval(() => {
      this.animate();
    }, 4000);
  }

  componentDidUpdate() {
    this.resetAnimate();
  }

  fastAnimate(ref, height) {
    setNativeProps(ref, {
      style: {
        top: height
      }
    });
  }

  animate() {
    this.curr ++;
    const length = this.props.sourceData.length;
    if (length < 2) {
      this.stopInterval();
      return;
    }
    const ref = findDOMNode(this.animateElement);
    // 42是每个item高度
    let height = this.itemHeight * this.curr;
    if (!isWeex) {
      height = getWebPx(height) + 'px';
    }
    transition(ref, {
      transform: `translate(0, -${height})`
    }, {
      timingFunction: 'ease-in-out',
      delay: 0,
      duration: 400
    });

    const curr = this.curr - 1;
    if (curr > 0 && curr % length === 0) {
      const round = curr / length;
      const itemRound = Math.round(round / 2);
      if (round % 2 === 1) {
        this.fastAnimate(this.animateElement1, this.itemHeight * length * 2 * itemRound);
      } else if (round % 2 === 0) {
        this.fastAnimate(this.animateElement2, this.itemHeight * length * (2 * itemRound + 1));
      }
      // 兼容安卓高度不够被内容被隐藏的bug
      setNativeProps(this.animateElement, {
        style: {
          height: this.itemHeight * this.itemHeight * length * (2 * itemRound + 2)
        }
      });
    }
  }

  // 还原初始高度
  resetAnimate() {
    const length = this.props.sourceData.length;
    if (length < 2) {
      return;
    }
    const ref = findDOMNode(this.animateElement);
    this.curr = 0;
    transition(ref, {
      transform: 'translate(0, 0)'
    }, {
      timingFunction: 'ease',
      delay: 0,
      duration: 0
    });
    this.fastAnimate(this.animateElement1, 0);
    this.fastAnimate(this.animateElement2, this.itemHeight * this.props.sourceData.length);
  }

  componentWillUnmount() {
    this.stopInterval();
  }

  startInterval() {
    this.resetAnimate();
    this.timmer && clearInterval(this.timmer);
    this.timmer = setInterval(() => {
      this.animate();
    }, 3000);
  }

  // 当不在可视区停止滚动计时
  stopInterval() {
    this.timmer && clearInterval(this.timmer);
    this.resetAnimate();
  }

  getNewsItem(item) {
    if (!item.appUrl || !item.content) {
      return null;
    }
    const appUrl = item.appUrl;
    return (
      <OpenUrl component={Text} url={appUrl} style={style.texts} numberOfLines="1">
        {item.content}
      </OpenUrl>
    );
  }

  render() {
    const dataSource = this.props.sourceData;
    const length = (dataSource || []).length;
    if (length < 2) {
      return null;
    }
    return (
      <RecyclerView.Cell style={style.container}>
        <Image
          source={{uri: 'https://cbu01.alicdn.com/cms/upload/2017/462/092/3290264_38443169.png'}}
          style={style.image}
          resizeMode="cover" />
        <View style={style.textsView} onAppear={this.startInterval} onDisappear={this.stopInterval}>
          <View style={{position: 'relative', height: this.itemHeight * length * 2}} ref={(node) => {
            this.animateElement = node;
          }}>
            <View style={[style.allView, {top: 0}]}
              ref={(node) => {
                this.animateElement1 = node;
              }}>
              {
                (dataSource || []).map(this.getNewsItem)
              }
            </View>
            <View
              style={[style.allView, {top: this.itemHeight * length}]}
              ref={(node) => {
                this.animateElement2 = node;
              }}>
              {
                (dataSource || []).map(this.getNewsItem)
              }
            </View>
          </View>
        </View>
      </RecyclerView.Cell>
    );
  }
}
