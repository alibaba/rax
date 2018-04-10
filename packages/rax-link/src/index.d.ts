import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * 链接
 * 文档地址 https://alibaba.github.io/rax/component/link
 */


export interface LinkProps extends BaseProps {


    href: string;

    /**
     * 点击事件
     * @param p
     */
    onPress?: (p: Function) => void;

}

declare class Link extends Rax.Component<LinkProps, any> {

    render(): JSX.Element;
}

export default Link;
