import {createElement, Component, findDOMNode, setNativeProps} from 'rax';
import Image from 'rax-image';
import View from 'rax-view';
import StyleSheet from 'universal-stylesheet';
import transition from 'universal-transition';

import Arrow from './Arrow';
import MenuItem from './MenuItem';

const ARROW_ICON = '//gw.alicdn.com/tfs/TB1aL6LQFXXXXbQXXXXXXXXXXXX-18-18.png';

export default class MenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible
    };
  }

  componentWillReceiveProps(nextProps) {
    const {visible} = this.state;
    const nextVisible = nextProps.visible;

    if (nextVisible && !visible) {
      this.setState({
        visible: nextVisible
      });
    } else {
      this.animate(nextVisible);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {visible} = this.state;

    if (visible && prevState.visible !== visible) {
      this.animate(visible);
    }
  }

  menuListRef = (ref) => {
    this.menuList = ref;
  }

  animate = (visible) => {
    const menuList = findDOMNode(this.menuList);
    if (visible) {
      setNativeProps(this.menuList, {
        style: {
          opacity: 0
        }
      });
      setTimeout(() => {
        transition(menuList, {
          opacity: 1
        }, {
          timingFunction: 'ease',
          delay: 0,
          duration: 300,
        }, () => {});
      }, 50);
    } else {
      setTimeout(() => {
        transition(menuList, {
          opacity: 0
        }, {
          timingFunction: 'ease',
          delay: 0,
          duration: 300,
        }, () => {
          this.setState({
            visible: false
          });
        });
      }, 50);
    }
  }

  renderItem = (item, index) => {
    const {title, onPress, children, titleStyle} = item;
    const {itemStyle, list = []} = this.props;
    const style = [itemStyle];
    if (index === list.length - 1) {
      style.push({borderBottomWidth: 0});
    }

    return children ? (
      <MenuItem
        key={index}
        style={style}
        onPress={onPress}
      >
        {children}
      </MenuItem>
    ) : (
      <MenuItem
        key={index}
        style={style}
        title={title}
        titleStyle={titleStyle}
        onPress={onPress}
      />
    );
  }

  render() {
    const {
      list,
      style = {},
      renderItem = this.renderItem,
      children,
      position = {top: 0, left: 0},
      showArrow = true,
      arrowIcon = ARROW_ICON,
      arrowPosition,
      arrowStyle
    } = this.props;
    const {visible} = this.state;
    const content = children ? children : list.map(renderItem);

    if (!visible) {
      return null;
    }

    return (
      <View
        ref={this.menuListRef}
        style={[menuListStyle.menuList, position, style]}
      >
        {content}
        {
          showArrow ? (
            <Arrow
              source={{uri: arrowIcon}}
              arrowPosition={arrowPosition}
              style={arrowStyle}
              containerWidth={style.width || menuListStyle.menuList.width}
            />
           ) : null
        }
      </View>
    );
  }
}

const menuListStyle = StyleSheet.create({
  menuList: {
    borderRadius: 4,
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: '#e7e7e7',
    borderWidth: 1,
    width: 210,
    position: 'fixed',
    opacity: 0
  }
});
