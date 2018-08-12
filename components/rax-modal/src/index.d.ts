import * as Rax from "rax";
import {BaseProps} from "rax";
import * as React from "react";


/**
 * component: modal(模态框)
 * document address(文档地址)：
 * https://alibaba.github.io/rax/component/modal
 */
export interface ListViewProps extends BaseProps {

    /**
     * trigger callback when displayed
     * (显示的时候触发回调)
     */
    onShow?: () => void;
    /**
     * trigger callback when hidden
     * (隐藏的时候触发回调)
     */
    onHide?: () => void;

    /**
     * modal content style
     * (模态框内容的样式)
     */
    contentStyle?: React.CSSProperties;

    /**
     * whether the modal box is visible
     * (模态框是否可见)
     * default(默认值): false
     */
    visible?: boolean;

}


declare class Modal extends Rax.Component<ListViewProps, any> {


    render(): JSX.Element;

    show: () => void;

    hide: () => void;

    /**
     * Switch display status
     * (切换显示状态)
     */
    toggle: (visible: boolean) => void;
}

export default Modal;
