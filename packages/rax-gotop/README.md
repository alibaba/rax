# Gotop 

[![npm](https://img.shields.io/npm/v/rax-gotop.svg)](https://www.npmjs.com/package/rax-gotop)

## Install

```bash
$ npm install --save rax-gotop
```

## Import

```jsx
import GoTop from 'rax-gotop';
```

default style：

```jsx
<GoTop />
```

user defined style：

```jsx
<GoTop name="click" icon="//gtms03.alicdn.com/tps/i3/TB1rrfVJVXXXXalXXXXGEZzGpXX-40-40.png" />
```
> Note: weex environment must be placed in the first position of ScrollView

## Props

| name      | type       | default  | describe   |
| :---------- | :------- | :--------------------------------------- | :--------------------- |
| name        | String   | Top                                      | icon text content                 |
| icon        | String   | default icon | icon URL            |
| iconWidth   | String   | 90                                    | container width        |
| iconHeight  | String   | 90                                    | container height        |
| borderColor | String   | rgba(0, 0, 0, 0.1)                       | container border color |
| bottom      | int      | 80                                       | distance from bottom                 |
| onShow      | function | function() {}                            | icon display callback               |
| onHide      | function | function() {}                            | icon disappear callback               |

## Example

```jsx
// demo
import { createElement, render, Component } from 'rax';
import GoTop from 'rax-gotop';
import ScrollView from 'rax-scrollview';
import Text from 'rax-text';

class GoTopDemo extends Component {
  render() {
    return (
      <ScrollView ref={(scrollview) => {
          this.scrollview = scrollview; 
        }}>
        <GoTop name="Top" style={{width: 100, height: 100}}
          onTop={() => { 
            this.scrollview.scrollTo({y: 0});
          }}
          icon="//gtms03.alicdn.com/tps/i3/TB1rrfVJVXXXXalXXXXGEZzGpXX-40-40.png" />
        {Array.from({length: 50}).map((_, idx) => (
          <Text style={{fontSize: 50}}>hello world {idx}</Text>
        ))}
      </ScrollView>
    );
  }
}

render(<GoTopDemo />);
```

