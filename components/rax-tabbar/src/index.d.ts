import * as Rax from "rax";
import {BaseProps} from "rax";
import {ImageSource} from "rax-image";
import * as React from "react";

/**
 * component:tabheader (导航切换)
 * document address(文档地址)：
 * https://alibaba.github.io/rax/component/tabheader
 */

export interface TabHeaderProps extends BaseProps {

    /**
     * whether horizontal scroll bar appears
     * (是否出现水平滚动条)
     * 默认值 false
     */
    horizontal?: boolean;

    /**
     * Navigation bar position
     * (导航条位置)
     * default(默认值)：top
     */
    position?: "top" | "bottom";

    /**
     * style attached to bar, where backgroundImage style does weex compatibility
     * (附加在bar上的样式，(其中backgroundImage样式做了weex兼容))
     * default(默认值)：{}
     */
    // style:React.CSSProperties;

    /**
     * if the tabbar is in RaxEmbed, whether the tabbar module is automatically hidden
     * (如果tabbar在RaxEmbed中，是否由自动隐藏tabbar模块)
     * default(默认值)：false
     * RaxEmbed: Reference weex source WeexEmbedComponent(参考weex源码 WeexEmbedComponent)
     * weex git:https://github.com/apache/incubator-weex/
     */
    autoHidden?: boolean;

    /**
     * bar background color
     * (bar的背景色)
     */
    barTintColor?: string;

    /**
     * check tab copy color
     * (选中tab的文案颜色)
     */
    tintColor?: string;

}

export interface TabBarItemProps {

    /**
     * selected items on the copy
     * (选中项上的文案)
     */
    title: string;

    /**
     * style attached to tab (where backgroundImage style is weex compatible)
     * (附加在tab上的样式，[其中backgroundImage样式做了weex兼容])
     */
    style: React.CSSProperties;

    /**
     * icon picture url
     * (icon图片url)
     */
    icon: ImageSource;

    /**
     * tab selected state icon url
     * (tab选中状态icon的url)
     */
    selectedIcon: ImageSource;

    /**
     * icon style
     * (icon的样式)
     * default(默认值): {width: 48,height:48}
     */
    iconStyle: React.CSSProperties;

    /**
     * tab selected style icon
     *(tab选中状态icon的样式)
     */
    selectedStyle: React.CSSProperties;

    /**
     * checked
     * (是否选中)
     * default(默认值):false
     */
    selected?: boolean;

    /**
     * the number of messages revealed
     * (透出的消息数)
     */
    badge?: string | number;

    /**
     * effective only in weex: Click on the current item action to change to "Open a page"
     * (仅weex中生效：点击当前项动作改为“打开一个页面”)
     */
    href?: string;

    /**
     * selected callbacks for handling page switching in h5
     * (选中的回调，用于处理h5中页面切换)
     * @param event
     */
    onPress: (...event) => void;
}

declare class Item extends Rax.Component<TabBarItemProps, any> {

    static defaultProps: {
        style: React.CSSProperties
    };

    render(): JSX.Element;
}

declare class TabHeader extends Rax.Component<TabHeaderProps, any> {

    public static Item: Item;

    static defaultProps: {
        autoHidden: true
    };


    // static defaultProps: {
    //     scrollEventThrottle: number;
    //     onEndReachedThreshold: number;
    //     showsHorizontalScrollIndicator: boolean;
    //     showsVerticalScrollIndicator: boolean;
    //     className: string;
    // };


    render(): JSX.Element;


}

export default TabHeader;
