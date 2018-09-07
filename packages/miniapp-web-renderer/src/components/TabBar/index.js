import { createElement, Component } from 'rax';
import TabBarItem from './item';

export default class TabBar extends Component {
  render() {
    const { config } = this.props;
    const list = config.list || [];
    return (
      <view style={styles.tabbarWrapper}>
        {list.map((item, index) => {
          return <TabBarItem key={index} data={item} />;
        })}
      </view>
    );
  }
}

const styles = {
  tabbarWrapper: {
    width: '750rem',
    height: '96rem',
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
  },
};
