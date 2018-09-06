import { createElement, Component } from 'rax';

import TabBar from '../TabBar';

export default class Container extends Component {
  render() {
    const { manifest } = this.props;
    const tabBar = manifest.tabBar;
    return (
      <view
        style={{
          margin: '0',
          position: 'absolute',
          width: '100vw',
          top: '0',
          bottom: '0',
          left: '0',
          right: '0',
        }}
      >
        <view
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: '0',
            bottom: tabBar ? '12.8vw' : '0',
            left: '0',
            right: '0',
            margin: '0',
            overflow: 'hidden',
          }}
        >
          {this.props.children}
        </view>
        {tabBar && <TabBar config={tabBar} />}
      </view>
    );
  }
}
