import { createElement, Component } from 'rax';

export default class TabBar extends Component {
  render() {
    const { tabBar, pages } = this.props;
    const list = tabBar.list || [];
    return (
      <view style={styles.tabbarWrapper}>
        {list.map((item, index) => {
          return (
            <navigator
              key={index}
              style={styles.link}
              url={`/${pages[item.pageName]}`}
              id={`tabbar-page-${item.pageName}`}
              data-page-name={item.pageName}
            >
              <image style={styles.icon} src={item.iconPath} aria-hidden="true" />
              <view style={styles.text}>{item.text}</view>
            </navigator>
          );
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
  link: { textAlign: 'center' },
  icon: { width: '31.5rem', height: '31.5rem' },
  text: { fontSize: '24rem', color: '#686868', whiteSpace: 'nowrap', lineHeight: '1' },
};
