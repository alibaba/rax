import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * 按钮
 * 文档地址 https://alibaba.github.io/rax/component/button
 */
export interface ButtonProps extends BaseProps {

    /**
     * 点击事件
     * @param p
     */
    onPress?: (p: Function) => void;

}

declare class Button extends Rax.Component<ButtonProps, any> {

    render(): JSX.Element;
}

export default Button;
