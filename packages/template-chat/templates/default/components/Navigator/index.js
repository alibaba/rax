import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import TabBar from 'rax-tabbar';
import styles from './navigatior.css';

export default class extends Component {

  render() {
    const { title = '', children } = this.props;

    return (
      <View style={styles.navContainer}>
        <Text style={styles.navTitle}>{title}</Text>
        {children}
      </View>
    );
  }
}