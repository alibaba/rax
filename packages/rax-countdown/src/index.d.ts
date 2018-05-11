import * as Rax from "rax";
import {BaseProps} from "rax";
import * as React from "react";

/**
 * component：countdown(倒计时)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/countdown
 */
export interface CountdownProps extends BaseProps {

    /**
     * Countdown remaining time in "milliseconds"(倒计时剩余时间,单位为"毫秒")
     */
    timeRemaining: number;
    /**
     * Countdown interval in units of "milliseconds"( 倒计时的间隔,单位为"毫秒")
     * default(默认值):1000
     */
    interval?: number;
    /**
     * Countdown presentation template, defaults to {d} days {h} {m} minutes {s} seconds
     * (倒计时展示模板,默认为'{d}天{h}时{m}分{s}秒')
     * default(默认): {d} days {h} {m} minutes {s} seconds ({d}天{h}时{m}分{s}秒{ms})
     */
    tpl?: string;

    /**
     * The method of customizing the remaining time of the format,
     * when the non-undefined time tpl fails, the display of the remaining time is processed
     * (自定义格式化剩余时间的方法,非undefined时tpl失效,处理剩余时间的展示)
     *
     * @param {number} imeRemaining Countdown remaining time Unit is "milliseconds" (倒计时剩余时间 单位为"毫秒")
     */
    formatFunc?: (timeRemaining: number) => void;
    /**
     * Method called when countdown changes (倒计时变化时调用的方法)
     * @param {number} timeRemaining Countdown remaining time Unit is "milliseconds"(倒计时剩余时间 单位为"毫秒")
     */
    onTick?: (timeRemaining: number) => void;
    /**
     * The method called when the countdown is completed (倒计时完成时调用的方法)
     */
    onComplete?: () => void;

    /**
     *Time - digital style( 时间-数字的样式)
     */
    timeStyle?: React.CSSProperties;
    /**
     * Second last style (秒最后一位样式)
     */
    secondStyle?: React.CSSProperties;
    /**
     * Time - style of the unit (时间-单位的样式)
     */
    textStyle?: React.CSSProperties;
    /**
     * The style of each time block (各时间区块的样式)
     */
    timeWrapStyle?: React.CSSProperties;
    /**
     * Each time block background (can add background image) ( 各时间区块背景(可加背景图)
     */
    timeBackground?: React.CSSProperties;
    /**
     * Time block background style (各时间区块背景样式)
     */
    timeBackgroundStyle?: React.CSSProperties;

}

declare class Countdown extends Rax.Component<CountdownProps, any> {


    render(): JSX.Element;
}

export default Countdown;
