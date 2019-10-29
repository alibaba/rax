import { createElement } from 'rax';
import Image from 'rax-image';
import Text from 'rax-text';
import View from 'rax-view';
import styles from './index.css';

export default function TabBar(props) {
  const {
    backgroundColor = '#FFF',
    history,
    items = [],
    pathname,
    selectedColor = '#333',
    textColor = '#666'
  } = props;

  return (
    <View style={{ ...styles.tabBar, backgroundColor }}>
      {items.map((item, index) => {
        const selected = item.pagePath === pathname;
        const itemTextColor = item.textColor || textColor;
        const itemSelectedColor = item.selectedColor || selectedColor;

        return (
          <View
            key={`tab-${index}`}
            style={styles.tabBarItem}
            onClick={() => {
              history.push(item.pagePath);
            }}>
            <Image
              style={{
                ...styles.tabBarItem_img,
                display: selected && item.activeIcon ? 'block' : 'none'
              }}
              source={{ uri: item.activeIcon }} />
            <Image
              style={{
                ...styles.tabBarItem_img,
                display: !selected && item.icon ? 'block' : 'none'
              }}
              source={{ uri: item.icon }} />
            <Text
              style={{
                ...styles.tabBarItem_txt,
                color: selected ? itemSelectedColor : itemTextColor
              }}
            >{item.name}</Text>
          </View>
        );
      })}
    </View>
  );
}
