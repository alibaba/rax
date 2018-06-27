# Picture

[![npm](https://img.shields.io/npm/v/rax-picture.svg)](https://www.npmjs.com/package/rax-picture)

Complex image component

## Install

```bash
$ npm install rax-picture --save
```

## Import

```jsx
import Picture from 'rax-picture';
```

## Props

| name      | type       | default  | describe   |
| :--------------- | :------ | :-------- | :----------------------------- |
| source           | object  | {uri: ''} | picture source（need）                 |
| style            | object  |           | must set style.width ，style.height ，（need） |
| resizeMode       | string  | stretch   | How to adjust the size of the picture when the picture size is out of proportion       |
| forceUpdate      | boolean | false     | Picture is a PureComponent ，It will render when porps.source.uri has change (in shouldComponentUpdate), If you want to ignore shouldComponentUpdate，you need `forceUpdate={true}` |
| width            | number  |           | picture width (px)        |
| height           | number  |           | picture height (px)       |
| lazyload         | boolean | false     | （for web）picture lazyload，useing：` //g.alicdn.com/kg/appear/0.2.2/appear.min.js` |
| autoPixelRatio   | boolean | true      | （for web）high resolution   |
| placeholder      | string  |           | （for web）background image for lazyload      |
| autoRemoveScheme | boolean | true      | （for web) Automatic deletion protocol header    |


** resizeMode value：**

* cover: Scale the image uniformly (maintain the image's aspect ratio) so that both dimensions (width and height) of the image will be equal to or larger than the corresponding dimension of the view (minus padding).
* contain: Scale the image uniformly (maintain the image's aspect ratio) so that both dimensions (width and height) of the image will be equal to or less than the corresponding dimension of the view (minus padding).
* stretch: Scale width and height independently, This may change the aspect ratio of the src.

(must set `style.width` && `style.height`)

## Example

```jsx
import {createElement, Component, render} from 'rax';
import ScrollView from 'rax-scrollview';
import 'rax-components'; // hack for rax-picture@0.2.5
import Picture from 'rax-picture';

class Demo extends Component {
  render() {
    return <ScrollView ref='scroll'>
       <Picture
         source={{
           uri: '//gw.alicdn.com/tfscom/tuitui/TB2jLF1lXXXXXc7XXXXXXXXXXXX_!!0-dgshop.jpg',
         }}
         style={{
           width: 375,
           height: 252
         }}
         lazyload={true}
         resizeMode="cover"
       />
    </ScrollView>;
  }
}
render(<Demo />);
```

## Local image example

useing image-source-loader in webpack.config.js 

```jsx 
import {createElement, Component, render} from 'rax';
import Image from 'rax-image';

class App extends Component {
  render() {
    return (
      <Image source={require('./path/to/your/image.png')}
        resizeMode="cover"
      />
    );
  }
}

render(<App />);
```