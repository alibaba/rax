import * as Rax from "rax";
import {BaseProps} from "rax";


/**
 * component: gotop(返回顶部)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/gotop
 */
export interface GoTopProps extends BaseProps {

    /**
     * icon text content ( 图标文字内容)
     * default(默认值)：Top
     */
    name?: string;

    /**
     * Internal default icon (内部默认图标)
     */
    icon?: string;

    /**
     * back to top Container width (返回顶部容器宽度)
     * default(默认值) 90
     */
    iconWidth?: string;

    /**
     * back to top Container height (返回顶部容器高度)
     * default(默认值) 90
     */
    iconHeight?: string;

    /**
     * back to top container border color (返回顶部容器边框颜色)
     * default(默认值) rgba(0, 0, 0, 0.1)
     */
    borderColor?: string;

    /**
     * distance from the bottom (离底部的距离)
     * default(默认值) 80
     */
    bottom?: number;

    /**
     * icon show callback (显示回调)
     */
    onShow?: () => void;

    /**
     * icon hide callback (消失回调)
     */
    onHide?: () => void;

}


declare class GoTop extends Rax.Component<GoTopProps, any> {


    render(): JSX.Element;


}


export default GoTop;
