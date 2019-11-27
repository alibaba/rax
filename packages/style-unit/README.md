# style-unit

> Unit conversion for calculating dimensional css attributes, especially for rpx.

## API

convertUnit(value, prop, platform);

| Property | Type          | Required | Description                                                  |
| -------- | ------------- | -------- | ------------------------------------------------------------ |
| value    | string/number | true     |                                                              |
| prop     | string        | true     |                                                              |
| platform | string        | false    | Different platforms have different rpx conversion. Details are as follows. |

## Web 

In Web, Calculate rpx to vw (relative to viewport width 750). 

750rpx -> 100vw

### setViewportWidth

You can use `setViewportWidth` method update viewport width

setViewportWidth(1500);

750rpx -> 50vw


## Weex 

In Web, Calculate rpx to px (viewport width is 750). 

750rpx -> 750px

### setRpx

You can use `setRpx` method update coefficient of 750

setRpx(1500 / 750)

750rpx -> 1500px

## MiniApp

rpx (responsive pixel): Adaptable to the screen width in MiniApp. The specified screen width is 750 rpx. If the screen width on iPhone6 is 375 px (750 physical pixels), then 750 rpx = 375 px = 750 physical pixels, i.e. 1 rpx = 0.5 px = 1 physical pixel.

## Node.js

Use Weex result:
```
convertUnit('500rpx', 'width', 'weex')
```
Use Web result:
```
convertUnit('500rpx', 'width', 'web')
```