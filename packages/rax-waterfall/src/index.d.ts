import {BaseProps} from "rax";
import * as React from "react";


export interface WaterFallItem {

    height: number
}

export interface WaterFallProps extends BaseProps {

    /**
     * 瀑布流数组，需要传入模块高度（必填）
     */
    dataSource: Array<WaterFallItem>;
    /**
     * 渲染每项的模板（必填）
     */
    renderItem: () => void;
    /**
     * 渲染 header 部分
     */
    renderHeader?: () => void;
    /**
     * 渲染 footer 部分
     */
    renderFooter?: () => void;
    /**
     *    列宽
     */
    columnWidth?: number;

    /**
     * 列数
     */
    columnCount?: number;
    /**
     * 列间距
     */
    columnGap?: number;
    /**
     * 滚动到底部触发事件
     */
    onEndReached?: () => void;

    /**
     * 触发懒加载距离
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
