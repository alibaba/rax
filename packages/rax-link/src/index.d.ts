import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component: link(链接)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/link
 */

export interface LinkProps extends BaseProps {


    /**
     * href
     */
    href: string;

    /**
     * click event(点击事件)
     * @param args
     */
    onPress?: (...args) => void;

}

declare class Link extends Rax.Component<LinkProps, any> {

    render(): JSX.Element;
}

export default Link;
