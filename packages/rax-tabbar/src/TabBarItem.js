import {createElement, Component} from 'rax';
import Text from 'rax-text';
import Image from 'rax-image';
import Touchable from 'rax-touchable';
import Link from 'rax-link';
import View from 'rax-view';
import Icon from 'rax-icon';
import {getScrollViewItemStyle} from './hackIOS8Styles';
import separateStyle from './separateStyle';
import {isWeex} from 'universal-env';
class TabBarItem extends Component {
  static defaultProps = {
    style: {},
  }

  onPress = () => {
    // api
    if (this.props.onPress) {
      this.props.onPress(this.props);
    }
    // not api
    if (this.props.handleTouchTap) {
      this.props.handleTouchTap(this.props.index);
    }
  };


  getItemStyle = () => {
    if (this.props.selected) {
      return Object.assign({}, this.props.style, this.props.selectedStyle);
    }
    return Object.assign({}, this.props.style);
  };

  renderBadge() {
    const {
      badge
      } = this.props;

    const badgeStyle = this.compatRNApi_badge();
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

  renderIcon() {
    let icon = this.props.icon;
    if (this.props.selected) {
      icon = this.props.selectedIcon ? this.props.selectedIcon : this.props.icon;
    }

    if (icon && icon.uri && !icon.codePoint) {
      return <Image style={[styles.icon, this.props.iconStyle || {}]} source={icon} />;
    } else if (icon && icon.uri && icon.codePoint) {
      return <Icon style={[styles.icon, this.props.iconStyle || {}]} fontFamily="iconfont" source={icon} />;
    }
    return null;
  };

  compatRNApi_badge() {
    if (this.props.badgeColor) {
      return Object.assign({}, this.props.badgeStyle, {
        color: this.props.badgeColor
      });
    } else {
      return Object.assign({}, this.props.badgeStyle);
    }
  }

  render() {
    let styleTab = styles.tab;
    if (this.props.inHorizontal) {
      styleTab = styles.tabStaticWidth;
    }

    const {
      icon,
      title
      } = this.props;

    let Tag = Touchable;
    let TagAttrs = {};
    if (isWeex && !this.props.selected && this.props.href) {
      Tag = Link;
      TagAttrs.href = this.props.href;
    }
    if (this.props.id) {
      TagAttrs.id = this.props.id;
    }

    let boxStyle = this.getItemStyle();
    let bgImgInfo = separateStyle(boxStyle, 'backgroundImage', {
      width: boxStyle.width,
      height: boxStyle.height,
    });

    Object.assign(boxStyle, getScrollViewItemStyle(this.props, boxStyle));

    return (
      <Tag {...TagAttrs} onPress={this.onPress} style={[styleTab, boxStyle]}>
        {bgImgInfo ? <Image source={{uri: bgImgInfo.uri}} style={[styles.tabBackgroundImage, bgImgInfo]} /> : null}
        <View style={styles.innerWrap}>
          {this.renderIcon()}
          <Text style={[styles.title, separateStyle(boxStyle, 'text')]}>{title}</Text>
          {this.renderBadge()}
        </View>
      </Tag>
    );
  }
}

const styles = {
  tabStaticWidth: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    verticalAlign: 'top'
  },
  tab: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    verticalAlign: 'top'
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