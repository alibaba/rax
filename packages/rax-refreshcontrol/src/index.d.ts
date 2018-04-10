import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * 下拉刷新
 * 文档地址 https://alibaba.github.io/rax/component/refresh-control
 */

export interface RecyclerViewProps extends BaseProps {

    /**
     * 是否显示
     */
    refreshing: boolean
    /**
     * 监听下拉刷新的行为
     */
    onRefresh?: () => void;
}


declare class RefreshControl extends Rax.Component<RecyclerViewProps, any> {


    render(): JSX.Element;


}


export default RefreshControl;
