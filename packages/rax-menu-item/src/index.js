import {createElement, Component} from 'rax';
import Image from 'rax-image';
import View from 'rax-view';
import Text from 'rax-text';
import Link from 'rax-link';
import styles from './style.js';

class Menu extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.dataSource || nextProps.dataSource.id !== this.props.dataSource.id;
  }
  render() {
    let {dataSource, ...otherProps} = this.props;
    if (!dataSource) {
      return (<View style={[styles.container, styles.placeholder]} />);
    }

    return (
      <View style={styles.container} {...otherProps}>
      {
        dataSource.map((item, index) => {
          return (<Link key={index} href={item.url} style={styles.item}>
            <View style={styles.childItem}>
              <Image source={{uri: item.icon}} style={styles.icon} />
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <View style={styles.childItem}>
              <Text style={styles.text}>{item.text}</Text>
              <Image source={{uri: '//gw.alicdn.com/tfs/TB1jx_APVXXXXXgXpXXXXXXXXXX-14-26.png'}} style={styles.arrow} />
            </View>
          </Link>);
        })
      }
      </View>
    );
  }
}

export default Menu;
