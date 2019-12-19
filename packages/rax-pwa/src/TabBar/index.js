import { createElement, useEffect, useState, Fragment } from 'rax';
import Image from 'rax-image';
import Text from 'rax-text';
import View from 'rax-view';
import styles from './index.css';

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
        <View style={{ ...styles.tabBar, backgroundColor }}>
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
