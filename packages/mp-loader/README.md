# mp-loader

> A webpack loader that transform mini program stynax into rax component.

## Install

```bash
$ npm install --save mp-loader
```

### MP(Mini Program) DSL
> MP DSL will compile to rax component.

```js
Component({
  data: {
    name: 'world'
  },
  methods: {
    onChange(e) {
      this.setData({
        name: 'rax' 
      });
    }
  }
});
```

```css
/* index.acss */
.hello {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 40px;
  text-align: center;
}
```

```html
<!-- index.axml -->
<view class="hello">
  <text class="title" onClick="change">Hello {{name}}</text>
</view>
```