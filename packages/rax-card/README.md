# Card

[![npm](https://img.shields.io/npm/v/rax-card.svg)](https://www.npmjs.com/package/rax-card)

Card container with default style

## Install

```bash
$ npm install rax-card --save
```

## Import

```jsx
import Card from 'rax-card';
```

## Example

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Card from 'rax-card';

class App extends Component {
  render() {
    return (
      <View style={{ width: 750 }}>
      	<Card style={{
          width: 700, 
          margin: 25,
          borderColor: '#efefef',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 20,
        }}>
          <Card.Header><Text>header</Text></Card.Header>
          <Card.Content>
            <Text>
              this is a card this is a card this is a card this is a card this is a card this is a card this is a card 
            </Text>
          </Card.Content>
          <Card.Footer><Text>f</Text><Text>f</Text></Card.Footer>
        </Card>
      </View>
    );
  }
}

render(<App />);
```