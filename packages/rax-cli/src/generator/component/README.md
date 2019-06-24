## <%= answers.name%>
<%= answers.description %>

## Install

```
$ npm install <%= answers.name%> --save
```

## Usage

```
import MyComponent from '<%= answers.name%>';
```

## API

### Props

|name|type|default|describe|
|:---------------|:--------|:----|:----------|
|name|String|''|describe|

### Function

|name|param|return|describe|
|:---------------|:--------|:----|:----------|
|name|Object|/|describe|

## Example

```
import {createElement, Component, render} from 'rax';
import View from 'rax-view';

class App extends Component {
  render() {
    return (
      <View>
      	{ /* your code */ } 
      </View>
    );
  }
}

render(<App />);
```
