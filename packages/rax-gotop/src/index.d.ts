import * as Rax from "rax";
import {BaseProps} from "rax";


/**
 *返回顶部
 *文档地址 https://alibaba.github.io/rax/component/gotop
 */

export interface GoTopProps extends BaseProps {

    /**
     * 图标文字内容
     * 默认值：Top
     */
    name?: string;
    /**
     * 内部默认图标
     */
    icon?: string;
    /**
     *返回顶部container宽度
     * 默认值 90
     */
    iconWidth?: string;
    /**
     * 返回顶部container高度
     *  默认值 90
     */
    iconHeight?: string;
    /**
     * 返回顶部container border颜色
     * 默认值 rgba(0, 0, 0, 0.1)
     */
    borderColor?: string;
    /**
     * 离底部的距离
     * 默认值 80
     */
    bottom?: number;
    /**
     *icon显示回调
     */
    onShow?: () => void;
    /**
     * icon消失回调
     */
    onHide?: () => void;

}


declare class GoTop extends Rax.Component<GoTopProps, any> {


    render(): JSX.Element;


}


export default GoTop;
