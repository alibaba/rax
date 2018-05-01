import * as Rax from "rax";
import {BaseProps} from "rax";
import * as React from "react";


/**
 * component：checkbox (选择框)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/checkbox
 */
export interface CheckBoxProps extends BaseProps {

    /**
     * selected state (选中状态)
     */
    checked: boolean;

    /**
     * picture selected  (处于选中状态中的图片)
     */
    checkedImage: string;

    /**
     * unselected picture (非选中状态中的图片)
     */
    uncheckedImage: string;

    /**
     * select box container style (选择框容器样式)
     */
    containerStyle: React.CSSProperties;

    /**
     * select box picture style (选择框图片样式)
     */
    checkboxStyle: React.CSSProperties;

    /**
     * change event (选择事件)
     * @param checked checked(是否选中)
     */
    onChange: (checked) => void;

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
