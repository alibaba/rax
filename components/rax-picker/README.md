# Picker

[![npm](https://img.shields.io/npm/v/rax-picker.svg)](https://www.npmjs.com/package/rax-picker)

Picker is the basis of the drop-down selection box, call the system to select the original box

## Install

```bash
$ npm install rax-picker --save
```

## Import

```jsx
import Picker from 'rax-picker';
```

## Props

| name      | type       | default  | describe   |
| :------ | :------- | :--- | :--- |
| selectedValue | String |      | default selected value |
| onValueChange | Function |      | value change event |

Options are defined using Picker.Item, Example：

```
<Picker.Item value={'somevalue'} />
```

## Example

```jsx
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Picker from 'rax-picker';

class App extends Component {
  state = {
    selectedValue: '女'
  };
  render() {
    return (
      <View style={{ width: 750 }}>
        <Text>选择性别</Text>
        <Picker 
          selectedValue={this.state.selectedValue}
          onValueChange={(value, index) => {
            this.setState({selectedValue: value});
          }}>
          <Picker.Item value={'男'} label={'男性'} />
          <Picker.Item value={'女'} label={'女性'} />
        </Picker>
      </View>
    );
  }
}

render(<App />);
```