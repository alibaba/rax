# rax-navigation [![npm](https://img.shields.io/npm/v/rax-navigation.svg)](https://www.npmjs.com/package/rax-navigation)

## Install

```bash
npm install --save rax-navigation
```

## Usage

```js
import {render, createElement, Component} from 'rax';
import {StackNavigator} from 'rax-navigation';
import Button from 'rax-button';

class MainScreen extends Component {
  static navigationOptions = {
    title: 'Welcome'
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Button
        title="Go to Jane's profile"
        onPress={() => {
          navigate('Profile', { name: 'Jane' })
        }}
      />
    );
  }
}

class ProfileScreen extends Component {
  static navigationOptions = {
    title: ({state}) => state.params.name,
    header: false
  };
  render() {
    const { goBack } = this.props.navigation;
    return (
      <Button
        title="Go back"
        onPress={() => goBack()}
      />
    );
  }
}

const BasicApp = StackNavigator({
  Main: {screen: MainScreen},
  Profile: {screen: ProfileScreen},
});

render(<BasicApp />);
```
