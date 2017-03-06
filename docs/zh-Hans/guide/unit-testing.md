# 单元测试

Rax 默认使用 [jest](https://facebook.github.io/jest/) 做单元测试.

## 配置

安装测试必要的包 

```bash
npm i --save-dev jest babel-jest babel-preset-es2015 babel-preset-rax rax-test-renderer
```

接着在 `.babelrc` 文件中加入 presets 变量

```json
{
  "presets": ["es2015", "rax"]
}
```

配置 `package.json`

```json
{
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "collectCoverage": true
  }
}
```

## 如何写测试

拿开源的 [Link](https://github.com/alibaba/rax/blob/master/packages/rax-link/src/__tests__/Link.js) 介绍

1. 在 [rax-link](https://github.com/alibaba/rax/tree/master/packages/rax-link) 目录下的 [src](https://github.com/alibaba/rax/tree/master/packages/rax-link/src) 中创建 [__tests__](https://github.com/alibaba/rax/tree/master/packages/rax-link/src/__tests__) 目录.

2. 接着在 `__tests__` 目录下创建两个文件分别是 [Link.js](https://github.com/alibaba/rax/blob/master/packages/rax-link/src/__tests__/Link.js) 和 [Link.weex.js](https://github.com/alibaba/rax/blob/master/packages/rax-link/src/__tests__/Link.weex.js)


在 `Link.js` 中写入下面的代码
```jsx
import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Link from '../Link';

describe('Link', () => {
  it('should render a link', () => {
    const component = renderer.create(
      <Link>Example</Link>
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('A');
    expect(tree.children[0].children[0]).toEqual('Example');
  });

  it('should turn onPress to onClick', () => {
    const mockPress = jest.fn();
    const component = renderer.create(
      <Link onPress={mockPress}>Example</Link>
    );
    let tree = component.toJSON();
    expect(tree.eventListeners.click).toBe(mockPress);
  });

  it('is error in a parent link', () => {
    const component = renderer.create(
      <Link>
        <Link>Example</Link>
      </Link>
    );
    let tree = component.toJSON();
    expect(tree.children).toBe(undefined);
  });
});
```

在 `Link.weex.js` 中写入下面的代码

```jsx
import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Link from '../Link';

jest.mock('universal-env', () => {
  return {
    isWeex: true
  };
});

describe('Link in weex', () => {
  it('should render a link', () => {
    const component = renderer.create(
      <Link>Example</Link>
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('A');
    expect(tree.children[0].tagName).toEqual('TEXT');
    expect(tree.children[0].attributes.value).toEqual('Example');
  });
});
```

> 注意： 为了 mock weex 环境，你需要在本地文件中重新修改 `universal-env`

