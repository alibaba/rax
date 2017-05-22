import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Link from 'rax-link';
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
        <Link href={dataSource[0].url}>
          <View style={styles.videoTop}>
            <Picture source={{uri: dataSource[0].coverImage}} style={styles.videoBackgroudImage} />
            <View style={styles.videoIcon}>
              <Text style={styles.videoIconText}>视频</Text>
            </View>
            <Picture source={{uri: '//gw.alicdn.com/tfs/TB1f4NPQFXXXXbKaXXXXXXXXXXX-272-272.png'}} style={styles.videoButton} />
          </View>
          <View style={styles.videoBottom}>
            <View>
              <Text style={styles.titleText}>{dataSource[0].title}</Text>
            </View>
            <View>
              <Text numberOfLines="2" style={styles.descText}>{dataSource[0].summary}</Text>
            </View>
          </View>
        </Link>
      </View>
    );
  }
}


export default Demo;
