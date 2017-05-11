# Modal 

[![npm](https://img.shields.io/npm/v/rax-modal.svg)](https://www.npmjs.com/package/rax-modal)

## Install

```bash
$ npm install rax-modal --save
```

## Import

```jsx
import Modal from 'rax-modal';
```

## Props

| name      | type       | default  | describe   |
| :----------- | :------- | :---- | :-------------- |
| onShow       | Function |       | Modal show event      |
| onHide       | Function |       | Modal hide event      |
| contentStyle | Object   |       | Modal content style   |
| visible      | Boolean  | false | if Modal is visible   |

## Example

```jsx
// demo 
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

