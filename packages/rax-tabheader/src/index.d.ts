import * as Rax from "rax";
import {BaseProps} from "rax";
import * as React from "react";
import {Requireable} from "react";

/**
 * component:tabheader(导航切换)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/tabheader
 */

/**
 * 注意：
 *   当选择带有底部滑动边框或者背景滑块的 type 时，renderItem、renderSelect 不用传入当选择 dropDown-border-scroll 类型时，
 *   必须传入 dropDownColstype
 * type 值对应的展示类型含义
 *   dropDown-border-scroll 带有下拉的展现形式，带有底边移动动画效果，样式规范遵循 MXUI
 *   normal-border-scroll 无下拉的展现形式，带有底边移动动画效果，样式规范遵循 MXUI
 *   icon-bg-scroll 每一项带有图标的展现形式，带有背景移动动画效果，样式规范遵循 MXUI
 *   default-noAnim-scroll 默认可扩展的自定义展现，1.x.x 版本的基本功能
 *   normal-border  不可滚动的 tab 选项，带有底边移动动画效果，样式规范遵循 MXUI
 *   icon-bg  每一项带有图标的展现形式，不可横向滚动，带有背景移动动画效果，样式规范遵循 MXUI
 *   icon-border 每一项带有图标的展现形式，不可横向滚动，带有背景移动动画效果，样式规范遵循 MXUI
 */
type TabHeaderType = "dropDown-border-scroll" | "normal-border-scroll"
    | "icon-bg-scroll"
    | "default-noAnim-scroll"
    | "normal-border"
    | "icon-bg"
    | "icon-border"

export interface TabHeaderProps extends BaseProps {

    /**
     * tab option data
     * (tab 选项的数据)
     */
    dataSource: Array<any>;

    /**
     * render each template
     * (渲染每项的模板)
     */
    renderItem: (item: any) => void;

    /**
     * each fixed width can be set, or it can be calculated by calculating each width
     * (可以设置每项固定宽度，也可以通过计算每个宽度不同)
     * default(默认值):300
     */
    itemWidth?: string

    /**
     * select the template for the navigation item
     * (select the template for the navigation item)
     */
    renderSelect?: () => void;

    /**
     * select a tab event
     * (选中某一 tab 事件)
     * @param {number} index selected item
     * @returns {{}}
     */
    onSelect: (index: number) => void,

    /**
     * selected navigation item, starting from 0
     * (选中的导航项，从0开始)
     */
    selected?: number;


    /**
     *  navigation default style type
     *  (导航默认展现样式类型)
     *  default(默认值)：'default-noAnim-scroll'
     */
    type?: TabHeaderType;

    /**
     * navigation default presentation style
     * (导航默认展现样式)
     */
    containerStyle?: React.CSSProperties;

    /**
     * single tab presentation style
     * (单个tab展现样式)
     */
    itemStyle?: React.CSSProperties;

    /**
     * single tab display style
     * (单个选中tab展现样式)
     */
    itemSelectedStyle?: React.CSSProperties;

    /**
     * slide color display style
     * (滑动色块展现样式)
     */
    animBuoyStyle?: React.CSSProperties;

    /**
     * dropdown column number
     * (下拉列表的列数)
     */
    dropDownCols?: number;
}

export interface TabHeaderScrollTo {

    x: string | number
}

declare class TabHeader extends Rax.Component<TabHeaderProps, any> {


    static childContextTypes: {
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
     * select the nth navigation item (this triggers the onSelect event)
     * (选择第n个导航项目，[这会触发onSelect事件])
     * @param n
     */
    select: (n: number) => void;

    /**
     * select the nth navigation item (onSelect event will not be triggered), generally used to synchronize the navigation state
     * (选择第n个导航项目（不会触发onSelect事件），一般用于同步导航状态)
     * @param n
     */
    selectInternal: (n: number) => void;

    /**
     * set the horizontal scroll position
     * (设置水平滚动位置)
     * @param p parameter example: {x:'100rem'}
     */
    scrollTo: (p: TabHeaderScrollTo) => void;


}

export default TabHeader;
