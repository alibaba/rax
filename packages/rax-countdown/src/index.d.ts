import * as Rax from "rax";
import {BaseProps} from "rax";
import * as React from "react";

/**
 * 倒计时
 * 文档地址：https://alibaba.github.io/rax/component/countdown
 */
export interface CountdownProps extends BaseProps {

    /**
     * 倒计时剩余时间,单位为"毫秒"
     */
    timeRemaining: number;
    /**
     * 1000    倒计时的间隔,单位为"毫秒"
     */
    interval?: number;
    /**
     * {d}天{h}时{m}分{s}秒{ms}    倒计时展示模板,默认为'{d}天{h}时{m}分{s}秒'
     */
    tpl?: string;

    /**
     * 自定义格式化剩余时间的方法,非undefined时tpl失效,处理剩余时间的展示
     * @param {number} imeRemaining 倒计时剩余时间 单位为"毫秒"
     */
    formatFunc?: (timeRemaining: number) => void;
    /**
     * 倒计时变化时调用的方法
     * @param {number} timeRemaining 倒计时剩余时间 单位为"毫秒"
     */
    onTick?: (timeRemaining: number) => void;
    /**
     * 倒计时完成时调用的方法
     */
    onComplete?: () => void;
    /**
     * 时间-数字的样式
     */
    timeStyle?: React.CSSProperties;
    /**
     * 秒最后一位样式
     */
    secondStyle?: React.CSSProperties;
    /**
     * 时间-单位的样式
     */
    textStyle?: React.CSSProperties;
    /**
     * 各时间区块的样式
     */
    timeWrapStyle?: React.CSSProperties;
    /**
     * 各时间区块背景(可加背景图)
     */
    timeBackground?: React.CSSProperties;
    /**
     * 各时间区块背景样式
     */
    timeBackgroundStyle?: React.CSSProperties;

}

declare class Countdown extends Rax.Component<CountdownProps, any> {


    render(): JSX.Element;
}

export default Countdown;
