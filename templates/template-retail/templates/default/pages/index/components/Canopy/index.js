import { createElement, PureComponent, PropTypes as T } from 'rax';
import { Image, View, Text } from 'rax-components';
import styles from './style';

const CANOPY_IMAGE_URL = 'https://cbu01.alicdn.com/cms/upload/2017/972/092/3290279_2093810242.png';
const SCAN_IMAGE_URL = 'https://cbu01.alicdn.com/cms/upload/2017/533/092/3290335_2093810242.png';
const MESSAGE_IMAGE_URL = 'https://cbu01.alicdn.com/cms/upload/2017/982/192/3291289_2093810242.png';
const SEARCH_IMAGE_URL = 'https://cbu01.alicdn.com/cms/upload/2017/294/133/3331492_2093810242.png';

const noop = () => {};

class Canopy extends PureComponent {
  static propTypes = {
    onScan: T.func,
    onMessage: T.func,
    onSearch: T.func,
    messageNum: T.number, // '99+' maybe
    searchKeyword: T.string,
    searchPlaceholder: T.string
  }

  static defaultProps = {
    onScan: noop,
    onMessage: noop,
    onSearch: noop,
    messageNum: 0
  }

  renderPlaceholder() {
    const { searchKeyword, searchPlaceholder } = this.props;
    if (searchKeyword) {
      return <Text style={[styles.position, styles.keyword]}>{searchKeyword}</Text>;
    } else if (searchPlaceholder) {
      return <Text style={[styles.position, styles.placeholder]}>{searchPlaceholder}</Text>;
    }

    return null;
  }

  formatMessageNum(num) {
    return num > 99 ? '99+' : '' + num;
  }

  render() {
    const { onScan, onMessage, onSearch, messageNum } = this.props;

    return [
      <Image key="canopy" style={styles.image} source={{ uri: CANOPY_IMAGE_URL }} />,
      <View key="navbar" style={styles.header}>
        <View style={styles.iconWrapper} onClick={onScan} >
          <Image style={styles.scan} source={{ uri: SCAN_IMAGE_URL }} />
        </View>
        <View style={styles.searchbar} onClick={onSearch}>
          <Image style={styles.searchIcon} source={{ uri: SEARCH_IMAGE_URL }} />
          {this.renderPlaceholder()}
        </View>
        <View style={styles.iconWrapper} onClick={onMessage}>
          <Image style={styles.message} source={{ uri: MESSAGE_IMAGE_URL }} />
          {messageNum > 0 ? <Text style={styles.newMessage}>{this.formatMessageNum(messageNum)}</Text> : null}
        </View>
      </View>
    ];
  }
}

export default Canopy;
