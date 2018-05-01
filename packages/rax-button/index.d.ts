import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component：button (按钮)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/button
 */
export interface ButtonProps extends BaseProps {

    /**
     * press event (点击事件)
     * @param callback  (回调函数)
     */
    onPress?: (callback: Function) => void;

}

declare class Button extends Rax.Component<ButtonProps, any> {

    render(): JSX.Element;
}

export default Button;
