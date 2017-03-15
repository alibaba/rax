# Modal 模态框

## 安装

```bash
$ npm install rax-modal --save
```

## 引用

```jsx
import Modal from 'rax-modal';
```

## 属性

| 名称           | 类型       | 默认值   | 描述              |
| :----------- | :------- | :---- | :-------------- |
| onShow       | Function |       | 显示的时候触发回调       |
| onHide       | Function |       | 隐藏的时候触发回调       |
| contentStyle | Object   |       | Modal 内容的 style |
| visible      | Boolean  | false | 模态框是否可见         |

## 基本使用

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

