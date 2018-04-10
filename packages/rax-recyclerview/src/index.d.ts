import * as Rax from "rax";
import {BaseProps} from "rax";
import * as React from "react";
import {Requireable} from "react";
import {ScrollEvent, ViewPosition} from "../rax-scrollview";

/**
 *滚动容器
 *文档地址 https://alibaba.github.io/rax/component/recycler-view
 */

export interface RecyclerViewProps extends BaseProps {

    /**
     * 滚动到底部触发事件，将修改后的数据付给 data
     */
    onEndReached: () => void;
    /**
     * 距离多少开始加载下一屏，数字单位默认 rem
     * 默认值 500
     */
    onEndReachedThreshold: number

    /**
     * 滚动时触发的事件，返回当前滚动的水平垂直距离
     */
    //onScroll: () => void;


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


export default RecyclerView;
