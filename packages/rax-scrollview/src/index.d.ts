import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component: scroll-view(滚动容器)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/scroll-view
 */

export interface ScrollViewProps extends BaseProps {

    /**
     * this property controls how often the scroll event is called during scrolling (the default value is 100). Throttling for scrolling
     * (这个属性控制在滚动过程中，scroll事件被调用的频率（默认值为100），用于滚动的节流)
     */
    scrollEventThrottle?: number;

    /**
     * set to scroll horizontally
     * (设置为横向滚动)
     * default(默认值)：false
     */
    horizontal?: boolean;

    /**
     * whether horizontal scroll bar is allowed
     * (是否允许出现水平滚动条)
     * default(默认值)：true
     */
    showsHorizontalScrollIndicator?: boolean;

    /**
     * whether vertical scroll bar is allowed
     * default(默认值)：true
     */
    showsVerticalScrollIndicator?: boolean;

    /**
     * set to load more offsets
     * (设置加载更多的偏移)
     * default(默认值)：500
     */
    onEndReachedThreshold?: number;

    /**
     * fires when the scroll area has the length of onEndReachedThreshold left
     * (滚动区域还剩 onEndReachedThreshold 的长度时触发)
     */
    onEndReached?: () => void;

    /**
     * the event fired when scrolling, return the horizontal and vertical distance of the current scroll
     * (滚动时触发的事件，返回当前滚动的水平垂直距离)
     * @param {WeexScrollEvent}event
     */
    onScroll?: (event: WeexScrollEvent) => void;


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

export interface WeexScrollEvent {

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


    handleScroll: (event: WeexScrollEvent) => void;

    /**
     * rest scroll
     * (重置滚动)
     */
    resetScroll: () => void;


    /**
     * scroll to the specified location
     * (滚动到指定位置)
     * @param p parameter example(参数示例)：{x:0, y:100}
     */
    scrollTo: (p: ViewPosition) => void;
}

export default ScrollView;
