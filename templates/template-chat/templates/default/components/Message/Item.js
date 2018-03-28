import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Touchable from 'rax-touchable';
import PanResponder from 'universal-panresponder';
import styles from './item.css';

export default class MessageItem extends Component {
  state = {
    isTouching: false
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onPanResponderRelease: this._handlePanResponderEnd
    });
  }
  _handleStartShouldSetPanResponder = (evt, gestureState) => {
    this.setState({ isTouching: true });
    return true;
  }
  _handlePanResponderEnd = (evt, gestureState) => {
    this.setState({ isTouching: false });
  }

  startChat = () => {
    const { name = '' } = this.props;
    alert(`chat with ${name}`);
  }
  render() {
    const {
      name = '',
      key,
      header,
      content,
      time
    } = this.props;
    const { isTouching } = this.state;
    const bgc = isTouching ? 'rgba(0, 0, 0, 0.03)' : '#fff';
    return (
      <Touchable onPress={this.startChat} {...this._panResponder.panHandlers}>
        <View style={[styles.item, { borderBottomWidth: 1, borderTopWidth: key ? 0 : 1 }, {
          backgroundColor: bgc
        }]}>
          <View style={[styles.itemContent]}>
            <Image
              style={[styles.header]}
              source={header}
            />
            <View style={{ width: 500 }}>
              <Text
                style={styles.text}
                numberOfLines={1}
              >{name}</Text>
              <Text
                numberOfLines={1}
                style={styles.contentText}
              >{content}</Text>
            </View>
          </View>
          <View style={styles.time}>
            <Text style={styles.timeText}>{time}</Text>
          </View>
        </View>
      </Touchable>
    );
  }
}
