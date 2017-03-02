# Modal 模态框

## 安装

```bash
$ npm install rax-modal --save
```

## 使用

```jsx
/** @jsx createElement */
import {Component, createElement, render} from 'rax';
import Text from 'rax-text';
import View from 'rax-view';
import Touchable from 'rax-touchable';
import Modal from 'rax-modal';

class Example extends Component {
  showModal = () => {
    this.refs.modal.show();
  };

  hideModal = () => {
    this.refs.modal.hide();
  };

  render() {
    return (
      <View>
        <Touchable onPress={this.showModal}>
          <Text>
            Open
          </Text>
        </Touchable>
        <Modal ref="modal">
          <View>
            <Text>
              I am a dialog
            </Text>
          </View>
          <Touchable onPress={this.hideModal}>
            <Text>
              Close
            </Text>
          </Touchable>
        </Modal>
      </View>
    );
  }
}

render(<Example />);
```

## Props

* onShow - Show callback.
* onHide - Hide callback. 
* contentStyle - CSS styles to apply to the modal's content
* visible - Modal visible at initialization.