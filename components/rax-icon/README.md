# Icon 

[![npm](https://img.shields.io/npm/v/rax-icon.svg)](https://www.npmjs.com/package/rax-icon)

Icon components to achieve the W3C standard IconFont interface.

## Install

```bash
$ npm install rax-icon --save
```

## Import

```jsx
import Icon, {createIconSet} from 'rax-icon';
```

## Init

use iconfont：

```jsx
<Icon style={{width: 100, height: 100}} fontFamily="iconfont" source={{uri: '//at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf', codePoint: '\uE60f'}}/>
```

use image：

```jsx
<Icon style={{width: 100, height: 100}} source={{uri: icon}}/>
```

use createIconSet：

```jsx
const IconFont = createIconSet({ hello: '\ue60f' }, 'iconfont', 'http://at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf');
<IconFont name={'hello'}/>
```

## API

### Props

| name      | type       | default  | describe   |
| :--------------- | :----- | :--- | :------------------------------------- |
| source.uri       | String | ''   | image type icon URL, if it occurs, then font and codePoint two attribute failure |
| fontFamily       | String | ''   | iconfont font family                    |
| source.codePoint | String | ''   | iconfont code point                      |

### Function

- **IconComponent createIconSet(Object map, String name, String url);**

Parameter

- map：Description character set mapping，eg：`{ hello: '\ue60f' }`
- name：Font name，example `'iconfont'`
- url: Font file URL

IconComponent props

| name      | type       | default  | describe   |
| :-------- | :----- | :--- | :----------- |
| name      | String | ''   | Font name        |
| codePoint | String | ''   | iconfont code point |

## Example

```jsx
// demo
import { createElement, render, Component } from 'rax';
import View from 'rax-view';
import Icon, {createIconSet} from 'rax-icon';

const IconFont1 = createIconSet({}, 'iconfont', 'https://at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf');
const IconFont2 = createIconSet({
    hello: '\uE60f'
  }, 'iconfont', 'https://at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf');
const icon = 'https://gw.alicdn.com/tfs/TB1KRRuQXXXXXbwapXXXXXXXXXX-200-200.png';

class Demo extends Component {
  render() {
    return (
      <View>
        <Icon source={{uri: icon}}/>
        <Icon fontFamily="iconfont" source={{uri: 'https://at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf', codePoint: '\uE60f'}}/>
        <IconFont1 codePoint={'\uE60f'}/>
        <IconFont2 name={'hello'}/>
      </View>
    );
  }
}

render(<Demo />);
```

