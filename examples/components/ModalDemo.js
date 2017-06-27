import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';
import TextInput from 'rax-textinput';
import Button from 'rax-button';
import Switch from 'rax-switch';
import Video from 'rax-video';
import ScrollView from 'rax-scrollview';
import TouchableHighlight from 'rax-touchable';
import Modal from 'rax-modal';

class ModalDemo extends Component {

  showModal = () => {
    this.refs.modal.show();
  };

  hideModal = () => {
    this.refs.modal.hide();
  };

  onShow = (param) => {
    console.log('modal show', param);
  };

  onHide = (param) => {
    console.log('modal hide', param);
  };

  render() {
    return (
      <View>
        <View style={styles.container}>

          <View style={styles.wrapper}>
            <TouchableHighlight
              style={styles.click}
              onPress={this.showModal}
            >
              <Text>
              Open
              </Text>
            </TouchableHighlight>

            <Modal
              ref="modal"
              contentStyle={styles.modalStyle}
              onShow={this.onShow}
              onHide={this.onHide}
            >
              <View style={styles.body}>
                <Text>
                Conetnt
                </Text>
              </View>
              <View style={styles.footer}>
                <TouchableHighlight style={styles.button} onPress={this.hideModal}>
                  <Text>
                  OK
                  </Text>
                </TouchableHighlight>
              </View>
              <TouchableHighlight style={styles.close} onPress={this.hideModal}>
                <Text style={styles.closeText}>
                x
                </Text>
              </TouchableHighlight>
            </Modal>

          </View>

        </View>
      </View>
    );
  }
}

let styles = {
  container: {
    padding: 20,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  wrapper: {
    paddingLeft: '24rem',
    paddingRight: '24rem',
    paddingTop: '24rem',
    flex: 1
  },
  click: {
    height: '100rem',
    lineHeight: '100rem',
    textAlign: 'center',
    borderWidth: '2rem',
    borderStyle: 'solid',
    borderColor: '#000000'
  },
  modalStyle: {
    width: '640rem',
    height: '340rem'
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e5e5',
    height: '220rem'
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '120rem'
  },
  button: {
    width: '300rem',
    height: '60rem',
    borderWidth: '2rem',
    borderStyle: 'solid',
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  close: {
    borderWidth: '2rem',
    borderStyle: 'solid',
    borderColor: '#000000',
    position: 'absolute',
    top: '-18rem',
    right: '-18rem',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40rem',
    height: '40rem',
    borderRadius: '20rem',
    backgroundColor: '#ffffff'
  },
  closeText: {
    fontSize: '28rem',
    color: '#000000'
  }
};

export default ModalDemo;
