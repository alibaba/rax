import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component: icon(图标)
 * document address(文档地址)：
 * https://alibaba.github.io/rax/component/icon
 */
export interface IconSource {
    /**
     * Picture icon url, if present, font and codePoint two properties are invalid
     * (图片型icon的url，如果出现，则font和codePoint两个属性失效)
     */
    uri?: string

    /**
     * iconfont code point (iconfont的码点)
     */
    codePoint: string
}

export interface IconProps extends BaseProps {


    /**
     * icon source
     */
    source: IconSource;

    /**
     * iconfont's font (iconfont的字体)
     */
    fontFamily?: string

}

declare class Link extends Rax.Component<IconProps, any> {

    render(): JSX.Element;
}

export default Link;
