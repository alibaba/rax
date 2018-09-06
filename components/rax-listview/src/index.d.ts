import * as Rax from "rax";
import {BaseProps} from "rax";
import {WeexScrollEvent, ViewPosition} from "rax-scrollview";
import RecyclerView from "rax-recyclerview";

/**
 * component:list-view(长列表)
 * document address(文档地址)：
 * https://alibaba.github.io/rax/component/list-view
 */

export interface ListViewProps extends BaseProps {

    /**
     * template method  (模板方法)
     * @param item  each row of data (每一行数据)
     * @param {number} index  array index(数组索引)
     */
    renderRow: (item: any, index: number) => void;

    /**
     * data to be rendered, used with renderRow
     * (需要渲染的数据，与 renderRow 配合使用)
     */
    dataSource: Array<any>;

    /**
     * scroll to the bottom to trigger the event and assign the modified data to data
     * (滚动到底部触发事件，将修改后的数据赋值给 data)
     */
    onEndReached?: () => void;

    /**
     * how much the distance starts loading the next screen, digital units default rem
     * (距离多少开始加载下一屏，数字单位默认 rem)
     * default(默认值):500
     */
    onEndReachedThreshold?: number;

    /**
     * the event fired when scrolling, return the horizontal and vertical distance of the current scroll
     * (滚动时触发的事件，返回当前滚动的水平垂直距离)
     * @param {WeexScrollEvent} event
     */
    onScroll?: (event: WeexScrollEvent) => void;


    /**
     * the list header needs to return the label to be rendered
     * (列表头部 需返回要渲染的标签)
     * @return {Object}
     */
    renderHeader?: () => Object;

    /**
     * the bottom of the list needs to return the label to be rendered (the loading chrysanthemum effect can be implemented here)
     * (列表底部 需返回要渲染的标签 (可以在此处实现 loading 菊花效果))
     * @return {Object}
     */
    renderFooter?: () => Object;

    /**
     * return to the listview's outer wrap container
     * (返回 listview 的外层包裹容器)
     * @param {RenderProps} p
     */
    renderScrollComponent?: (p: RenderProps) => RecyclerView;

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


    handleScroll: (event: WeexScrollEvent) => void;

    /**
     * scroll to the specified location (parameter example: {x:0} or {y:100})
     * (滚动到指定位置,[参数示例：{x:0} 或 {y:100}])
     */
    scrollTo: (p: ViewPosition) => void;
}

export default ListView;
