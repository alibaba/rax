# Binding

## Install

```bash
$ npm install universal-binding --save
```

## Usage

```jsx
import Binding from 'universal-binding';
```


## API


### Methods

|name|args|returns|description|
|:---------------|:--------|:----|:----------|
|bind|{object} options|{object}|bind an expression|
|unbind|{object} options| void |unbind an expression|
|unbindAll|无| void |unbind for all|

### Arguments Introduction

#### options

##### anchor {ElementReference|HTMLElement}

- element to trigger the animation ，
	- pass the element in web,such as ``` findDOMNode(this.refs.block) ```
	- pass the element ref in weex, `findDOMNode(this.refs.block).ref`

##### eventType {String}

- pass the type of event to trigger the binding, like `scroll`,`pan`,`timing`,`orientation`

##### instanceId {String}

- pass the instanceId in weex, you can use `document.id` to get it，you should't pass it in web

##### options {Object}

- option configs for binding
	- touchAction (web support only) ,you can pass `auto` or `pan-x` or `pan-y`,default value is `auto`
	- thresholdX (web support only)  default value is `10`,it means the `panstart` event won't be triggerred until the distance of touchmove `>10`
	- thresholdY (web support only)  default value is`10`
	- touchActionRatio (web support only) default value is `0.5`, it means the ratio of width/height

##### props {Array}

- elements for animation
   - element {ElementReference|HTMLElement}
	- expression {Object}
		- origin {String} binding expression
		- transformed {String}
	- property {String} property for animation
	- instanceId


## Example

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Binding from '@ali/universal-binding';
import View from 'rax-view';

class App extends Component {

  x = 0;
  y = 0;

  componentDidMount(){
  	this.bindEl();
  }

  onTouchStart(){
    this.bindEl();
  }

  bindEl(){
    let blockEl = this.refs.block;
    let token = Binding.bind({
      anchor: blockEl,
      eventType: 'pan',
      props: [
        {
          element: blockEl,
          property: 'transform.translateX',
          expression: {
            transformed: `{\"type\":\"+\",\"children\":[{\"type\":\"Identifier\",\"value\":\"x\"},{\"type\":\"NumericLiteral\",\"value\":\"${this.x}\"}]}`
          }
        },
        {
          element: blockEl,
          property: 'transform.translateY',
          expression: {
             transformed: `{\"type\":\"+\",\"children\":[{\"type\":\"Identifier\",\"value\":\"y\"},{\"type\":\"NumericLiteral\",\"value\":\"${this.y}\"}]}`
          }
        }]
      },(e)=>{

      if (e.state === 'end') {
        this.x += e.deltaX;
        this.y += e.deltaY;
      }

    });

  }

  render(){
		 return (<View onTouchStart={(e) => this.onTouchStart(e)} ref="block" style={{
		        position: 'absolute',
		        left: 0,
		        top: 0,
		        width: 300,
		        height: 300,
		        backgroundColor: 'red'
      }}>block</View>)
  }
}

render(<App />);
```



