/** @jsx createElement */
import {createElement, Component} from 'rax';
import Text from 'rax-text';
import Image from 'rax-image';
import TouchableOpacity from 'rax-touchable';
import Link from 'rax-link';
import View from 'rax-view';

const isWeex = typeof callNative !== 'undefined';

class TabBarItem extends Component {
  static defaultProps = {
    style: {},
  }

  onPress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props);
    }
    if (this.props.handleTouchTap && this.props.selfTabContentNotEmpty) {
      this.props.handleTouchTap(this.props.index);
    }
  };

  iconSource() {
    if (this.props.selected) {
      return this.props.selectedIcon ? this.props.selectedIcon : this.props.icon;
    }
    return this.props.icon;
  };

  boxStyle = () => {
    if (this.props.selected) {
      return Object.assign({}, this.props.style, this.props.selectedStyle);
    }
    return Object.assign({}, this.props.style);
  };

  styleFilter(target) {
    let boxStyle = this.boxStyle();
    switch (target) {
      case 'text': {
        let textKeys = ['color', 'fontSize', 'lineHeight'];
        let textStyle = {};
        for (let k in boxStyle) {
          if (textKeys.indexOf(k) >= 0) {
            textStyle[k] = boxStyle[k];
          }
        }
        return textStyle;
      }
    }
  }

  renderBadge() {
    const {
      badge,
      badgeStyle
      } = this.props;

    if (badge) {
      if (typeof badge == 'string' ) {
        return (
          <Text style={[styles.badge, badgeStyle]}>{badge}</Text>
        );
      } else if (typeof badge == 'object' && badge.uri) {
        return (
          <Image source={{uri: badge.uri}} style={[styles.badge, badgeStyle]} />
        );
      }
    }
    return null;
  }

  render() {
    if (this.props.selected) {
      // console.log(this.props)
    }

    let style_tab = styles.tab;
    if (this.props.widthFixed) {
      style_tab = styles.tab_width_fixed;
    }

    const {
      icon,
      title
      } = this.props;

    let Tag = TouchableOpacity;
    let TagAttrs = {};
    if (!this.props.selfTabContentNotEmpty && isWeex && !this.props.selected && this.props.href) {
      Tag = Link;
      TagAttrs.href = this.props.href;
    } else {
      TagAttrs.onPress = this.onPress;
    }

    if (this.props.id) {
      TagAttrs.id = this.props.id;
    }

    let boxStyle = this.boxStyle();

    let style_backgroundImage = {
      width: boxStyle.width,
      height: boxStyle.height,
      uri: boxStyle.backgroundImage ? boxStyle.backgroundImage.replace(/url\([\'\"]?([^\'\"]*)[\'\"]?\)/, '$1') : ''
    };
    delete boxStyle.backgroundImage;

    return (
      <Tag {...TagAttrs} style={[style_tab, boxStyle]}>
        <Image source={{uri: style_backgroundImage.uri}} style={[styles.tabBackgroundImage, style_backgroundImage]} />
        <View style={styles.innerWrap}>
          {icon ? <Image source={this.iconSource()} style={[styles.icon, this.props.iconStyle || {}]} /> : null}
          <Text style={[styles.title, this.styleFilter('text')]}>{title}</Text>
          {this.renderBadge()}
        </View>
      </Tag>
    );
  }
}

const styles = {
  tab_width_fixed: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBackgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  hasIcon: {
    justifyContent: 'space-between',
  },
  innerWrap: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: -6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    borderRadius: '100%',
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    backgroundColor: '#FF0000',
  },
  icon: {
    position: 'relative',
    width: 48,
    height: 48,
  },
  title: {
    fontSize: 28,
    lineHeight: '38rem'
  }
};

export default TabBarItem;