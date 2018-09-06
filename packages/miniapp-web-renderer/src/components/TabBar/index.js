import { createElement, Component } from 'rax';
import TabBarItem from './item';

class TabBar extends Component {
  render() {
    const { config } = this.props;
    const list = config.list || [];
    return (
      <view
        style={{
          width: '100vw',
          height: '12.8vw',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          position: 'absolute',
          left: 0,
          bottom: 0,
          borderTop: '1rem solid #eee',
          zIndex: 2,
        }}
      >
        {list.map((item, index) => {
          return <TabBarItem key={index} data={item} />;
        })}
      </view>
    );
  }
}

export default TabBar;
