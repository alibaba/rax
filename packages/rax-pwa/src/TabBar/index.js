import { createElement, useEffect, useState, Fragment } from 'rax';
import Image from 'rax-image';
import Text from 'rax-text';
import View from 'rax-view';
import getSafeAreaInsetBottom from '../getSafeAreaInsetBottom';

// There something wrong with style loader in "inlineStyle:false" project.
// Use Css in JS run anywhere.
const styles = {
  tabBar: {
    position: 'fixed',
    left: '0',
    right: '0',
    bottom: '0',
    height: '98rpx',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1rpx solid #eee',
    backgroundColor: '#fff',
  },

  tabBarItem: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabBarItemTxt: {
    fontSize: '24rpx',
  },

  tabBarItemImg: {
    marginBottom: '8rpx',
    width: '30rpx',
    height: '30rpx',
  }
};

const TAB_BAR_HEIGHT = 98;

export default function TabBar(props) {
  const [pathname, setPathname] = useState('');
  const { config = {}, history, onClick } = props;

  if (!history || !history.location) {
    throw new Error('TabBar should have a props of "history". See https://github.com/ReactTraining/history.');
  }

  const showTabBar =
    // Have tabBar config
    typeof config === 'object' && Array.isArray(config.items)
    // Current page need show tabBar
    && config.items.find(item => item.path === pathname);

  const {
    backgroundColor = '#FFF',
    items = [],
    selectedColor = '#333',
    textColor = '#666',
  } = config || {};

  useEffect(() => {
    setPathname(history.location.pathname);
    history.listen((location) => {
      setPathname(location.pathname);
    });
  }, []);

  return (
    <Fragment>
      {showTabBar ? (
        <View
          style={{
            ...styles.tabBar,
            backgroundColor,
            height: `${TAB_BAR_HEIGHT + getSafeAreaInsetBottom()}rpx`,
            paddingBottom: `${getSafeAreaInsetBottom()}rpx`
          }}
        >
          {items.map((item, index) => {
            const selected = item.path === pathname;
            const itemTextColor = item.textColor || textColor;
            const itemSelectedColor = item.selectedColor || selectedColor;
            return (
              <View
                key={`tab-${index}`}
                style={styles.tabBarItem}
                onClick={() => {
                  onClick && onClick(item);
                  if (!item.path) {
                    console.warn(`TabBar item ${item.name} need set path`);
                  } else {
                    history.push(item.path);
                  }
                }}>
                {selected && item.activeIcon ? (
                  <Image
                    style={styles.tabBarItemImg}
                    source={{ uri: item.activeIcon }} />
                ) : null}
                {!selected && item.icon ? (
                  <Image
                    style={styles.tabBarItemImg}
                    source={{ uri: item.icon }} />
                ) : null}
                <Text
                  style={{
                    ...styles.tabBarItemTxt,
                    color: selected ? itemSelectedColor : itemTextColor
                  }}
                >{item.name}</Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </Fragment>
  );
}
