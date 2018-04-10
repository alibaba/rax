import * as Rax from "rax";
import {BaseProps} from "rax";

export interface SwitchProps extends BaseProps {

    /**
     * 设置开关打开的背景色
     */
    onTintColor?: string;

    /**
     * 设置开关关闭时的背景色
     */
    tintColor?: string;

    /**
     * 开关圆形按钮的背景色
     */
    thumbTintColor?: string;

    /**
     * 开关是否可交互
     */
    disabled: boolean;
    /**
     * 开关默认状态开启或关闭
     */
    value: string;
    /**
     * 值改变时调用此函数
     */
    onValueChange: Function;

}

declare class Switch extends Rax.Component<SwitchProps, any> {

    render(): JSX.Element;
}

export default Switch;
