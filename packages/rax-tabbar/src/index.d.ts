import * as Rax from "rax";
import {BaseProps} from "rax";
import {ImageSource} from "rax-image";
import * as React from "react";

/**
 *导航切换
 *文档地址 https://alibaba.github.io/rax/component/tabheader
 */

export interface TabHeaderProps extends BaseProps {

    /**
     * 是否出现水平滚动条
     * 默认值 false
     */
    horizontal?: boolean;
    /**
     * 导航条位置（可选值top, bottom)
     * 默认值：top
     */
    position?: "top" | "bottom";
    /**
     * 附加在bar上的样式，(其中backgroundImage样式做了weex兼容)
     * 默认值：{}
     */
    // style:React.CSSProperties;

    /**
     * 如果tabbar在RaxEmbed中，是否由自动隐藏tabbar模块
     * 默认值 false
     */
    autoHidden?: boolean;
    /**
     * bar的背景色
     */
    barTintColor?: string;

    /**
     * 选中tab的文案颜色
     */
    tintColor?: string;

}

export interface TabBarItemProps {

    /**
     * 选中项上的文案
     */
    title: string;
    /**
     * 附加在tab上的样式（其中backgroundImage样式做了weex兼容）
     */
    style: React.CSSProperties;
    /**
     * icon图片url
     */
    icon: ImageSource;

    /**
     *tab选中状态icon的url
     */
    selectedIcon: ImageSource;
    /**
     * icon的样式
     * 默认值 {width: 48,height:48}
     */
    iconStyle: React.CSSProperties;
    /**
     * tab选中状态icon的样式
     */
    selectedStyle: React.CSSProperties;
    /**
     * 是否选中
     * 默认值 false
     */
    selected?: boolean;
    /**
     * 透出的消息数
     */
    badge?: string | number;
    /**
     *    仅weex中生效：点击当前项动作改为“打开一个页面”
     */
    href?: string;
    /**
     * 选中的回调，用于处理h5中页面切换
     */
    onPress: () => void;
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


    static defaultProps: {
        scrollEventThrottle: number;
        onEndReachedThreshold: number;
        showsHorizontalScrollIndicator: boolean;
        showsVerticalScrollIndicator: boolean;
        className: string;
    };


    render(): JSX.Element;


}

export default TabHeader;
