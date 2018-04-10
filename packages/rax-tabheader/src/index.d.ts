import * as Rax from "rax";
import {BaseProps} from "rax";
import * as React from "react";
import {Requireable} from "react";

/**
 *导航切换
 *文档地址 https://alibaba.github.io/rax/component/tabheader
 */

export interface TabHeaderProps extends BaseProps {

    /**
     * tab 选项的数据（必填）
     */
    dataSource: Array<any>;
    /**
     * 渲染每项的模板（必填）
     */
    renderItem: (item: any) => void;
    /**
     * 300    可以设置每项固定宽度，也可以通过计算每个宽度不同（必填）
     */
    itemWidth?: string
    /**
     * 选中导航项的模版
     */
    renderSelect?: () => void;

    /**
     * 选中某一 tab 事件
     * @param {number} index 选中的item
     * @returns {{}}
     */
    onSelect:(index:number)=>{},
    /**
     * 选中的导航项，从0开始
     */
    selected?: number;
    /**
     * 'default-noAnim-scroll'    导航默认展现样式
     * 注意：
     * 当选择带有底部滑动边框或者背景滑块的 type 时，renderItem、renderSelect 不用传入
     * 当选择 dropDown-border-scroll 类型时，必须传入 dropDownCols
     */
    type?: string;
    /**
     * 导航默认展现样式
     */
    containerStyle?: React.CSSProperties;
    /**
     * 单个 tab 展现样式
     */
    itemStyle?: React.CSSProperties;
    /**
     * 单个选中 tab 展现样式
     */
    itemSelectedStyle?: React.CSSProperties;
    /**
     * 滑动色块展现样式
     */
    animBuoyStyle?: React.CSSProperties;
    /**
     *    下拉列表的列数
     */
    dropDownCols?: number;
}

export interface TabHeaderScrollTo {
    x: string | number
}

declare class TabHeader extends Rax.Component<TabHeaderProps, any> {


    static childContextTypes : {
        tabheader: Requireable<any>;
    };


    static defaultProps: {
        scrollEventThrottle: number;
        onEndReachedThreshold: number;
        showsHorizontalScrollIndicator: boolean;
        showsVerticalScrollIndicator: boolean;
        className: string;
    };


    render(): JSX.Element;

    /**
     * 选择第n个导航项目（这会触发onSelect事件）
     * @param n
     */
    select: (n: number) => void;

    /**
     * 选择第n个导航项目（不会触发onSelect事件），一般用于同步导航状态
     * @param n
     */
    selectInternal: (n: number) => void;

    /**
     * 设置水平滚动位置，参数示例：{x:'100rem'}
     * @param p
     */
    scrollTo: (p: TabHeaderScrollTo) => void;


}

export default TabHeader;
