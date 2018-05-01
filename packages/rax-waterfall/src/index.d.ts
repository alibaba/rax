import {BaseProps} from "rax";
import * as React from "react";

/**
 * component:waterfall(瀑布流组件)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/waterfall
 */

export interface WaterFallItem {

    height: number;

    item: any
}

export interface WaterFallProps extends BaseProps {

    /**
     * waterfall stream array, need to pass module height
     * (瀑布流数组，需要传入模块高度)
     */
    dataSource: Array<WaterFallItem>;

    /**
     * render each template
     * (渲染每项的模板)
     * @param item
     * @param {number} index
     */
    renderItem: (item: any, index: number) => void;

    /**
     * rendering header section
     * (渲染 header 部分)
     */
    renderHeader?: () => void;

    /**
     * render footer section
     * (渲染 footer 部分)
     */
    renderFooter?: () => void;

    /**
     * column width
     *(列宽)
     */
    columnWidth?: number;

    /**
     * column count
     * (列数)
     */
    columnCount?: number;

    /**
     * column spacing
     * (列间距)
     */
    columnGap?: number;

    /**
     * scroll to bottom trigger event
     * (滚动到底部触发事件)
     */
    onEndReached?: () => void;

    /**
     * trigger lazy loading distance
     * 触发懒加载距离()
     */
    onEndReachedThreshold?: number;
}

declare class Header extends React.PureComponent<any, any> {


    render(): JSX.Element;
}


declare class WaterFall extends React.PureComponent<WaterFallProps, any> {


    public static readonly Header: Header;

    render(): JSX.Element;

    restScroll: () => void;
}

export default WaterFall;
