import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 *滚动容器
 *文档地址 https://alibaba.github.io/rax/component/scroll-view
 */

export interface ScrollViewProps extends BaseProps {

    /**
     * 这个属性控制在滚动过程中，scroll事件被调用的频率（默认值为100），用于滚动的节流
     */
    scrollEventThrottle?: number;
    /**
     * 设置为横向滚动
     */
    horizontal?: boolean;
    /**
     * 是否允许出现水平滚动条，默认true
     */
    showsHorizontalScrollIndicator?: boolean;
    /**
     * 是否允许出现垂直滚动条，默认true
     */
    showsVerticalScrollIndicator?: boolean;

    /**
     * 设置加载更多的偏移，默认值为500
     */
    onEndReachedThreshold?: number;

    /**
     * 滚动区域还剩 onEndReachedThreshold 的长度时触发
     */
    onEndReached?: () => void;

    /**
     * 滚动时触发的事件，返回当前滚动的水平垂直距离
     */
    onScroll?: Function;


}

export interface ViewPosition {
    x?: number;
    y?: number;
}

export interface ContentOffset {

    readonly x: number;

    readonly y: number
}

export interface ContentSize {

    readonly width: number;

    readonly height: number
}

export interface ScrollEvent {

    readonly contentSize: ContentSize;

    readonly contentOffset: ContentOffset;
}

declare class ScrollView extends Rax.Component<ScrollViewProps, any> {


    static propTypes: {};

    static defaultProps: {
        scrollEventThrottle: number;
        onEndReachedThreshold: number;
        showsHorizontalScrollIndicator: boolean;
        showsVerticalScrollIndicator: boolean;
        className: string;
    };


    render(): JSX.Element;


    handleScroll: (event: ScrollEvent) => void;

    /**
     * 重置滚动
     */
    resetScroll: () => void;


    /**
     * 滚动到指定位置（参数示例：{x:0, y:100}）
     */
    scrollTo: (p: ViewPosition) => void;
}

export default ScrollView;
