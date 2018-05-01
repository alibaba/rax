import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component: refresh-control(下拉刷新)
 * document address(文档地址)
 * https://alibaba.github.io/rax/component/refresh-control
 */

export interface RecyclerViewProps extends BaseProps {

    /**
     * whether to show
     * (是否显示)
     */
    refreshing: boolean
    /**
     * listen for drop-down refresh behavior
     * (监听下拉刷新的行为)
     * @param {WeexRefreshEvent}event
     */
    onRefresh?: (event: WeexRefreshEvent) => void;
}

/**
 * reference documents(参考文档)：https://weex.apache.org/cn/references/components/refresh.html
 */
export interface WeexRefreshEvent {

    /**
     * two times before and after the callback sliding distance difference
     * (前后两次回调滑动距离的差值)
     */
    dy: number;

    /**
     * drop-down distance
     * (下拉的距离)
     */
    pullingDistance: number;

    /**
     * refresh component height
     * (refresh 组件高度)
     */
    viewHeight: number;

    /**
     * constant string
     * (常数字符串)
     * example(例如)："pullingdown"
     */
    type: string;
}


declare class RefreshControl extends Rax.Component<RecyclerViewProps, any> {


    render(): JSX.Element;


}


export default RefreshControl;
