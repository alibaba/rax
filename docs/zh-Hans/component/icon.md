# Icon 图标

## 安装

```bash
import RaxIcon from 'rax-icon';
```

## 初始化组件
    
用iconfont：

```jsx
<RaxIcon style={{width: 100, height: 100}} fontFamily="iconfont" source={{uri: '//at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf', codePoint: '\uE60f'}}/>
```

用图片：

```jsx
<RaxIcon style={{width: 100, height: 100}} source={{uri: icon}}/>
```

## API说明

### 属性

|名称|类型|默认值|描述|
|:---------------|:------|:------|:----------|
|source.uri|String|''|图片型icon的url，如果出现，则font和codePoint两个属性失效|
|fontFamily|String|''|iconfont的字体|
|source.codePoint|String|''|iconfont的码点|


