import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Link from 'rax-link';
import ScrollView from 'rax-scrollview';
import Picture from 'rax-picture';
import styles from './style';

class Demo extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.dataSource ) {
      return true;
    } else {
      return false;
    }
  }
  render() {
    let {dataSource, ...otherProps} = this.props;
    if (!dataSource) {
      return null;
    }

    return (
      <View style={styles.root}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.scroller}>
          {dataSource.map((item, index) => {
            const name = item.name ? item.name.slice(0, 10) : '';
            const desc = item.desc ? item.desc.slice(0, 10) : '';
            return (
              <Link style={styles.link} href={item.url} key={index}>
                <Picture source={{uri: item.coverImage}} style={styles.pic} />
                <View style={styles.content}>
                  <Text numberOfLines="1" style={styles.name}>{name}</Text>
                  <Text numberOfLines="1" style={styles.desc}>{desc}</Text>
                </View>
              </Link>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}


export default Demo;