import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component:switch(开关按钮)
 * document address(文档地址)：
 * https://alibaba.github.io/rax/component/switch
 */

export interface SwitchProps extends BaseProps {

    /**
     * set the background color of the switch
     * (设置开关打开的背景色)
     */
    onTintColor?: string;

    /**
     * set the background color when the switch is off
     * (设置开关关闭时的背景色)
     */
    tintColor?: string;

    /**
     * the background color of the switch round button
     * (开关圆形按钮的背景色)
     */
    thumbTintColor?: string;

    /**
     * is disabled
     * (是否禁用)
     */
    disabled: boolean;

    /**
     * switch on or off by default
     * (开关默认状态开启或关闭)
     * default(默认值):true
     */
    value: boolean;

    /**
     * change event
     * (值改变时调用此函数)
     */
    onValueChange: (value: boolean) => void;

}

declare class Switch extends Rax.Component<SwitchProps, any> {

    render(): JSX.Element;
}

export default Switch;
