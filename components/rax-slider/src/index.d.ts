import * as Rax from "rax";
import {BaseProps} from "rax";
import * as React from "react";

/**
 * component:slider(轮播)
 * document address(文档地址)：
 * https://alibaba.github.io/rax/component/slider
 */


/**
 * Explanation:
 * In the web environment, the slider internally defaults to lazy loading of nodes. It is no longer necessary to use lazyload of picture to do lazy loading.
 * paginationStyle default style is：
 * (web 环境中 slider 内部默认做了节点的懒加载渲染，不再需要使用 picture 的 lazyload做懒加载，paginationStyle 默认样式为：)
 * {
 *   position: 'absolute',
 *   width: props.width,
 *   height: '40rem',
 *   bottom: '20rem',
 *   left: 0,
 *   itemColor: 'rgba(255, 255, 255, 0.5)',
 *   itemSelectedColor: 'rgb(255, 80, 0)',
 *   itemSize: '8rem'
 * }
 * itemColor is used to define the color of the origin of the page, itemSelectedColor is used to define the color when the page origin is activated, and itemSize is used to define the size of the page break.
 * (其中 itemColor 用来定义分页原点的颜色，itemSelectedColor 用来定义分页原点激活时的颜色，itemSize 用来定义分页圆点的大小)
 */


export interface SliderProps extends BaseProps {

    /**
     * slider width
     * (Slider的宽度)
     */
    width: string;

    /**
     * slider height
     * (Slider的高度)
     */
    height: string;

    /**
     * slider is auto play
     * (Slider是否自动播放)
     * default(默认值): false
     */
    autoPlay?: boolean;

    /**
     * Whether to display the small dots of paging
     * (是否显示分页的小圆点点)
     * default(默认值): false
     */
    showsPagination?: boolean;

    /**
     * define the dot style yourself, otherwise the default style will be centered
     *(自己定义小圆点点的样式，否则默认样式居中)
     */
    paginationStyle?: React.CSSProperties;

    /**
     * whether it is a loop (web)
     * (是否是循环播放)
     * default(默认值): true
     */
    loop?: boolean;

    /**
     * specifies the default number of initializations (compatibility issues with weex Android, which need to be called asynchronously after the node is rendered, not recommended)
     * (指定默认初始化第几个（在weex安卓下有兼容问题，需要节点渲染完成后异步调用，暂不推荐使用）)
     * default(默认值): 0
     */
    index?: number;

    /**
     * interval for automatic play，unit: millisecond
     * (自动播放的间隔时间，单位：毫秒)
     * default(默认值): 3000
     */
    autoPlayInterval?: number;

    /**
     * change event
     * @param {SliderChangeEvent} event
     */
    onChange?: (event: SliderChangeEvent) => void;

}

/**
 * reference documents(参考文档)：https://weex.apache.org/cn/references/components/slider.html
 */
export interface SliderChangeEvent {

    /**
     * displayed image index
     * 展示的图片索引
     */
    readonly index: number;

    /**
     * other attr
     * (其他属性)
     */
    readonly [key: string]: any

}

declare class Slider extends Rax.Component<SliderProps, any> {


    render(): JSX.Element;

    /**
     * scroll to a page
     * 滚动到某一页
     * @param {number}index
     */
    slideTo: (index: number) => void;

}

export default Slider;
