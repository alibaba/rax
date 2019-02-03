# Error Page

## 使用方法

导出一个 RaxComponent

接收以下 `props`

- message 文案信息
- showButton 是否显示按钮
  - default: `false`
- buttonText 按钮文案
  - default: 返回
- buttonLink
  - default: `{ type: 'pop' }`
  - `type` 可选: `pop | redirect | push`
  - 当 `type` 为 ` redirect | push` 的时候, 需传入 `page` 字段指定跳转路径 

## 视觉稿

![](https://gw.alicdn.com/tfs/TB1_7GprQCWBuNjy0FaXXXUlXXa-876-1596.png)