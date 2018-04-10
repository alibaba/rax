import * as Rax from "rax";
import {BaseProps} from "rax";
import {ScrollEvent, ViewPosition} from "rax-scrollview";
import * as React from "react";
import RecyclerView from "rax-recyclerview";

/**
 * 长列表
 * 文档地址：https://alibaba.github.io/rax/component/list-view
 */

export interface ListViewProps extends BaseProps {

    /**
     * 模板方法（必需）
     * @param item  每一行数据
     * @param {index} index  数组索引
     */
    renderRow: (item: any, index: number) => void;

    /**
     * 需要渲染的数据，与 renderRow 配合使用（必需）
     */
    dataSource: Array<any>;

    /**
     * 滚动到底部触发事件，将修改后的数据赋值给 data
     */
    onEndReached?: Function;

    /**
     * 500    距离多少开始加载下一屏，数字单位默认 rem
     */
    onEndReachedThreshold?: number;

    /**
     * 滚动时触发的事件，返回当前滚动的水平垂直距离
     */
    // onScroll: () => void;


    /**
     *  列表头部 需返回要渲染的标签
     * @return {React.ReactNode}
     */
    renderHeader: () => React.ReactNode;

    /**
     * 列表底部 需返回要渲染的标签 (可以在此处实现 loading 菊花效果)
     * @return {React.ReactNode}
     */
    renderFooter: () => React.ReactNode;

    /**
     * 返回 listview 的外层包裹容器
     * @param {RenderProps} p
     */
    renderScrollComponent: (p: RenderProps) => RecyclerView;

}

export interface RenderProps extends ListViewProps {
    ref: string;
    // children:Array<React.ReactNode>;
    _autoWrapCell: boolean
}

declare class ListView extends Rax.Component<ListViewProps, any> {

    static propTypes: {};

    static defaultProps: {
        renderScrollComponent: () => RecyclerView
        dataSource: Array<any>;
    };

    render(): JSX.Element;


    handleScroll: (event: ScrollEvent) => void;

    /**
     * 滚动到指定位置（参数示例：{x:0} 或 {y:100}）
     */
    scrollTo: (p: ViewPosition) => void;
}

export default ListView;
