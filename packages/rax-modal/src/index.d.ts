import * as Rax from "rax";
import {BaseProps} from "rax";
import * as React from "react";


/**
 * 模态框
 * 文档地址：https://alibaba.github.io/rax/component/modal
 */
export interface ListViewProps extends BaseProps {

    /**
     * 显示的时候触发回调
     */
    onShow?: () => void;
    /**
     * 隐藏的时候触发回调
     */
    onHide?: () => void;
    /**
     *    Modal 内容的 style
     */
    contentStyle?: React.CSSProperties;
    /**
     * 模态框是否可见
     * 默认值 false
     */
    visible?: boolean;

}


declare class Modal extends Rax.Component<ListViewProps, any> {


    render(): JSX.Element;

    show: () => void;
    hide: () => void;

    /**
     * 切换显示状态
     */
    toggle: (visible: boolean) => void;
}

export default Modal;
