import {createElement, cloneElement, findDOMNode, isValidElement, Component} from 'rax';
import View from 'rax-view';
import Image from 'rax-image';
import ScrollView from 'rax-scrollview';
import TabBarItem from './TabBarItem';
import TabBarContents from './TabBarContents';
import {getScrollViewStyle} from './hackIOS8Styles';
import separateStyle from './separateStyle';
import {isWeex} from 'universal-env';

var insideEmbed = false;
if (/[?&]{1}_page_inside_embed_=true(&?)/.test(location.search)) {
  insideEmbed = true;
}

class Tabbar extends Component {
  static Item = TabBarItem;

  static defaultProps = {
    autoHidden: true
  }

  state = {
    selectedIndex: -1,
  };

  handleTouchTap = (index) => {
    if (this.getTabs()[index].props && this.getTabs()[index].props.children) {
      const tabs = this.getTabs();

      this.setState({
        selectedIndex: index
      });

      this.scrollToSelectedItem(index);
    }
  };

  getTabs() {
    const tabs = [];
    let _children = this.props.children;
    if (!_children.map) {
      _children = [_children];
    }
    _children.map((tab) => {
      if (isValidElement(tab)) {
        tabs.push(tab);
      }
    });
    return tabs;
  }

  getTabItemWidth() {
    let tabs = this.getTabs();
    for (let i = 0; i < tabs.length; ++i) {
      if (tabs[i]) {
        return tabs[i].props.style.width;
      }
    }
  }

  setInitSelectedIndex() {
    let tabs = this.getTabs();
    let initSelectedIndex = 0;
    for (let i = 0; i < tabs.length; ++i) {
      if (tabs[i].props.selected === true) {
        initSelectedIndex = i;
        break;
      }
    }

    this.setState({
      selectedIndex: initSelectedIndex
    });
    this.initSelectedIndex = initSelectedIndex;
  }

  scrollToSelectedItem() {
    // scrollTo selected item
    let tabItemWidth = this.getTabItemWidth();
    let scrollLen = 0;
    if (tabItemWidth * (this.state.selectedIndex + 1) > 750 / 2) {
      scrollLen = tabItemWidth * this.state.selectedIndex - 750 / 2 + tabItemWidth / 2;
    }

    if (isWeex) {
      try {
        let dom = __weex_require__('@weex-module/dom');
        let k = parseInt(750 / tabItemWidth / 2);
        let selected = this.refs[`tab_${this.state.selectedIndex - k}`];
        if (selected) {
          dom.scrollToElement(findDOMNode(selected), {
            offset: 0
          });
        }
      } catch (e) {
        //
      }
    } else {
      if (findDOMNode(this.refs.ScrollBar)) {
        this.refs.ScrollBar.scrollTo({x: scrollLen});
      }
    }
  }

  componentWillMount() {
    this.setInitSelectedIndex();
  }

  componentDidMount() {
    this.scrollToSelectedItem();
  }

  compatRNApi_style() {
    if (this.props.barTintColor) {
      return Object.assign({}, this.props.style, {
        backgroundColor: this.props.barTintColor
      });
    } else {
      return Object.assign({}, this.props.style);
    }
  }

  render() {
    if (this.props.autoHidden && insideEmbed) {
      return null;
    }

    let tabContents = [];
    let tabContentsCount = 0;

    let tabs = this.getTabs().map((tab, index) => {
      if (tab.props.children) {
        tabContents.push(createElement(TabBarContents, {
          key: index,
          index: index,
          selected: this.state.selectedIndex === index,
        }, tab.props.children));
        ++ tabContentsCount;
      } else {
        tabContents.push(undefined);
      }

      return cloneElement(tab, {
        index: index,
        ref: `tab_${index}`,
        selected: this.state.selectedIndex === index,
        selectedIcon: tab.props.selectedIcon,
        handleTouchTap: this.handleTouchTap,
        inHorizontal: this.props.horizontal || false
      });
    });

    let tabbarStyle = this.compatRNApi_style();

    let barBgImgInfo = separateStyle(tabbarStyle, 'backgroundImage', {
      width: 750,
      height: tabbarStyle.height,
    });

    let tabsElement = null;
    if (this.props.horizontal) {
      tabsElement =
        <ScrollView ref="ScrollBar" horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={getScrollViewStyle()} style={[styles.bar]}>
          {tabs}
        </ScrollView>
      ;
    } else {
      tabsElement =
        <View style={[styles.bar]}>
          {tabs}
        </View>
      ;
    }

    let bar =
      <View style={[styles.barWrap, tabbarStyle]}>
        {barBgImgInfo ? <Image source={{uri: barBgImgInfo.uri}} style={[styles.barBgImg, barBgImgInfo]} /> : null}
        {tabsElement}
        {this.props.extraElement}
      </View>
    ;

    if (tabContentsCount == 0) {
      return bar;
    } else {
      if (this.props.position == 'bottom' || this.props.fixedPlace == 'bottom') {
        return (
          <View style={styles.container}>
            <View style={styles.content}>{tabContents}</View>
            {bar}
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            {bar}
            <View style={styles.content}>{tabContents}</View>
          </View>
        );
      }
    }
  }
}

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex'
  },
  content: {
    position: 'relative',
    display: 'flex',
    flex: 1
  },
  barWrap: {
    display: 'flex',
    flex: 'initial',
  },
  bar: {
    display: 'flex',
    whiteSpace: 'normal',
    flex: 'initial',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  barBgImg: {
    position: 'absolute',
    left: 0,
    top: 0
  }
};

export default Tabbar;
