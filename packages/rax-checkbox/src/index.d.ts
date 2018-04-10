import * as Rax from "rax";
import {BaseProps} from "rax";
import * as React from "react";

/**
 * 选择框
 * 文档地址 https://alibaba.github.io/rax/component/checkbox
 */
export interface CheckBoxProps extends BaseProps {

    /**
     * 选中状态
     */
    checked: boolean;
    /**
     *    选中图片
     */
    checkedImage: string;
    /**
     * 非选中图片
     */
    uncheckedImage: string;
    /**
     * 选择框容器样式
     */
    containerStyle: React.CSSProperties;
    /**
     * 选择框图片样式
     */
    checkboxStyle: React.CSSProperties;
    /**
     *    选择事件
     */
    onChange: () => void;

}

declare class CheckBox extends Rax.Component<CheckBoxProps, any> {

    static defaultProps: {
        checked: boolean;
        checkedImage: string;
        uncheckedImage: string;
    };

    render(): JSX.Element;
}

export default CheckBox;
