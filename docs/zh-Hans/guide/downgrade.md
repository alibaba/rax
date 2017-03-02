# 降级方案

业务可以通过以下几种形式进行降级，降级前必须确认WEB页面的可用性。

## 降级配置

通过 `__weex_downgrade__` 方法可以定制多个维度的降级信息。

降级配置示例：

```jsx
const config = {
  ios: {
    osVersion: '',
    appVersion: '<=6.3.0',
    weexVersion: '',
    deviceModel: ['iPhone5,1', 'iPhone5,2']
  },
  android: {
    osVersion: '',
    appVersion: '<=6.3.1',
    weexVersion: '',
    deviceModel: []
  }
};

__weex_downgrade__(config);
```

## 非Rax Framework环境

非 Rax Framework 环境下，所有业务将会自动降级到 web 页面。这是因为，构建工具在投放 bundle 中统一加了以下环境判断。

```jsx
const isDowngrade = false;
define('__rax_downgrade', function(require) {
  isDowngrade = true;
  var instanceWrap = require('@weex-module/instanceWrap');
  instanceWrap.error(1, 1000, 'Downgrade[rax]:: no built-in rax framework');
});
if (isDowngrade) return;
```


