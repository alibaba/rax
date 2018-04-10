import * as Rax from "rax";
import {BaseProps} from "rax";
import * as React from "react";

/**
 * Slider 轮播
 * 文档地址：https://alibaba.github.io/rax/component/slider
 */

// 说明：
// web 环境中 slider 内部默认做了节点的懒加载渲染，不再需要使用 picture 的 lazyload做懒加载
// paginationStyle 默认样式为
// {
//     position: 'absolute',
//         width: props.width,
//     height: '40rem',
//     bottom: '20rem',
//     left: 0,
//     itemColor: 'rgba(255, 255, 255, 0.5)',
//     itemSelectedColor: 'rgb(255, 80, 0)',
//     itemSize: '8rem'
// }
// 其中 itemColor 用来定义分页原点的颜色，itemSelectedColor 用来定义分页原点激活时的颜色，itemSize 用来定义分页圆点的大小

export interface SliderProps extends BaseProps {

    /**
     * Slider的宽度（必填）
     */
    width: string;
    /**
     * Slider的高度（必填）
     */
    height: string;
    /**
     * Slider是否自动播放
     * 默认值 false
     */
    autoPlay?: boolean;
    /**
     *    是否显示分页的小圆点点
     *    默认值：true
     */
    showsPagination?: boolean;
    /**
     *    自己定义小圆点点的样式，否则默认样式居中
     */
    paginationStyle?: React.CSSProperties;
    /**
     * 是否是循环播放（web）
     * 默认值:    true
     */
    loop?: boolean;
    /**
     * 指定默认初始化第几个（在weex安卓下有兼容问题，需要节点渲染完成后异步调用，暂不推荐使用）
     * 默认值：0
     */
    index?: number;

    /**
     * 自动播放的间隔时间
     * 默认值：30000
     */
    autoPlayInterval?: number;

    /**
     *change事件
     */
    onChange:(index:number)=>void;

}


declare class Slider extends Rax.Component<SliderProps, any> {


    render(): JSX.Element;

    slideTo:(index:number)=>void;
}

export default Slider;
