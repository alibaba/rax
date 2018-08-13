import * as Rax from "rax";
import {BaseProps} from "rax";
import * as React from "react";
import {Requireable} from "react";
import {WeexScrollEvent, ViewPosition} from "rax-scrollview";

/**
 * component: recycler-view(滚动容器)
 * document address(文档地址)：
 * https://alibaba.github.io/rax/component/recycler-view
 */

export interface RecyclerViewProps extends BaseProps {

    /**
     * scroll to the bottom to trigger the event and give the modified data to data
     * (滚动到底部触发事件，将修改后的数据付给 data)
     */
    onEndReached: () => void;
    /**
     * how much the distance starts loading the next screen, digital units default rem
     * (距离多少开始加载下一屏，数字单位默认 rem)
     *  default(默认值):500
     */
    onEndReachedThreshold: number

    /**
     * the event fired when scrolling, return the horizontal and vertical distance of the current scroll
     * (滚动时触发的事件，返回当前滚动的水平垂直距离)
     * @param {WeexScrollEvent}event
     */
    onScroll: (event: WeexScrollEvent) => void;


}

declare class Cell extends React.PureComponent<any, any> {

    static contextTypes: {
        isInARecyclerView: Requireable<any>;
    };

    render(): JSX.Element;
}

declare class Header extends React.PureComponent<any, any> {

    static contextTypes: {
        isInARecyclerView: Requireable<any>;
    };

    render(): JSX.Element;
}


declare class RecyclerView extends Rax.Component<RecyclerViewProps, any> {

    public static readonly Cell: Cell;

    public static readonly Header: Header;

    static defaultProps: {
        onEndReachedThreshold: number,
    };

    static childContextTypes: {
        isInARecyclerView: Requireable<any>
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


export default RecyclerView;
