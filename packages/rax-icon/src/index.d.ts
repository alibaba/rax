import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * 图标
 * 文档地址 https://alibaba.github.io/rax/component/icon
 */
export interface IconSource {
    /**
     * 图片型icon的url，如果出现，则font和codePoint两个属性失效
     */
    uri?: string

    /**
     * iconfont的码点
     */
    codePoint: string
}

export interface IconProps extends BaseProps {


    source: IconSource;

    /**
     * iconfont的字体
     */
    fontFamily?: string

}

declare class Link extends Rax.Component<IconProps, any> {

    render(): JSX.Element;
}

export default Link;
