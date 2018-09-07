import { createElement, Component } from 'rax';

import TabBar from '../TabBar';

export default class Container extends Component {
  render() {
    const { manifest } = this.props;
    const tabBar = manifest.tabBar;
    const pages = manifest.pages;
    return (
      <view style={styles.body}>
        <view style={[styles.main, { bottom: tabBar ? '12.8vw' : '0' }]}>{this.props.children}</view>
        {tabBar && <TabBar pages={pages} tabBar={tabBar} />}
      </view>
    );
  }
}

const styles = {
  body: {
    margin: '0',
    position: 'absolute',
    width: '750rem',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    margin: '0',
    overflow: 'hidden',
  },
};
