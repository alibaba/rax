/** @jsx createElement */
import {createElement, cloneElement, findDOMNode, isValidElement, Component} from 'rax';
import View from 'rax-view';
import ScrollView from 'rax-scrollview';
import Image from 'rax-image';
import TabBarItem from './TabBarItem';
import TabBarContents from './TabBarContents';

const isWeex = typeof callNative !== 'undefined';

class Tabbar extends Component {
  static Item = TabBarItem;

  static defaultProps = {
    autoHidden: true
  }

  state = {
    selectedIndex: -1,
  };

  handleTouchTap = (index) => {
    if (isWeex) {
      this.setState({
        selectedIndex: index
      });
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

  getTabWidth() {
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

    tabs[initSelectedIndex].props.id = 'selected';

    this.setState({
      selectedIndex: initSelectedIndex
    });
    this.initSelectedIndex = initSelectedIndex;

  }

  componentWillMount() {
    // console.log(this.props);
    this.insideEmbed = false;
    if (/[?&]{1}_page_inside_embed_=true(&?)/.test(location.search)) {
      this.insideEmbed = true;
    }
  }

  componentDidMount() {
    this.setInitSelectedIndex();
    if (isWeex) {
      let dom = require('@weex-module/dom');     
      let selected = findDOMNode('selected');
      // let selected = findDOMNode(tabs[initSelectedIndex]);

      if (selected) {
        dom.scrollToElement(selected.ref, {
          offset: 0
        });
      }
    } else {
      let tabWidth = this.getTabWidth();
      let scrollLen = 0;
      if (tabWidth * (this.initSelectedIndex + 1) > 750) {
        scrollLen = (tabWidth * (this.initSelectedIndex + 1) - 750 / 2 - tabWidth / 2) / 2;
      }

      if (findDOMNode(this.refs.ScrollBar)) {
        findDOMNode(this.refs.ScrollBar).scrollLeft = scrollLen;
      }
    }
  }

  render() {
    if (this.props.autoHidden && this.insideEmbed) {
      return null;
    }

    let tabContent = [];
    let tabContentCount = 0;

    let tabs = this.getTabs().map((tab, index) => {
      if (tab.props.children) {
        tabContent.push(createElement(TabBarContents, {
          key: index,
          index: index,
          selected: this.state.selectedIndex === index,
        }, tab.props.children));
        ++ tabContentCount;
      } else {
        tabContent.push(undefined);
      }

      return cloneElement(tab, {
        index: index,
        selected: this.state.selectedIndex === index,
        selectedIcon: tab.props.selectedIcon,
        handleTouchTap: this.handleTouchTap,
        selfTabContentNotEmpty: tab.props.children ? true : false,
        widthFixed: this.props.horizontal || false
      });
    });
    let tabsElement = null;

    let tabsElementStyle = Object.assign({}, this.props.style);
    let tabsElementBgImgStyle = null;
    if (tabsElementStyle.backgroundImage) {
      tabsElementBgImgStyle = {
        width: 750,
        height: tabsElementStyle.height,
        uri: tabsElementStyle.backgroundImage.replace(/url\([\'\"]?([^\'\"]*)[\'\"]?\)/, '$1')
      };
      delete tabsElementStyle.backgroundImage;
    }

    if (this.props.horizontal) {
      tabsElement = (
        <View style={[styles.barWrap, tabsElementStyle]}>
          {tabsElementBgImgStyle ? <Image source={{uri: tabsElementBgImgStyle.uri}} style={[styles.barBgImg, tabsElementBgImgStyle]} /> : null}
          <ScrollView ref="ScrollBar" horizontal={true} showsHorizontalScrollIndicator={false} style={[styles.bar]}>
            {tabs}
          </ScrollView>
          {this.props.extraElement}
        </View>
      );
    } else {
      tabsElement = (
        <View style={[styles.barWrap, tabsElementStyle]}>
          {tabsElementBgImgStyle ? <Image source={{uri: tabsElementBgImgStyle.uri}} style={[styles.barBgImg, tabsElementBgImgStyle]} /> : null}
          <View style={[styles.bar]}>
            {tabs}
          </View>
          {this.props.extraElement}
        </View>
      );
    }

    if (tabContentCount == 0) {
      return tabsElement;
    } else {
      if (this.props.fixedPlace == 'bottom') {
        return (
          <View style={styles.container}>
            <View style={styles.content}>{tabContent}</View>
            {tabsElement}
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            {tabsElement}
            <View style={styles.content}>{tabContent}</View>
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
