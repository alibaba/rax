/**
 * 渐变动画
 * https://alibaba.github.io/rax/component/transition
 */
import {default as React, ReactNode} from "react";

export interface TransitionOptions {

    /**
     * 指定动画的持续时间 (单位是毫秒)，默认值是 0，表示没有动画效果。
     */
    duration: number;

    /**
     * 描述动画执行的速度曲线，用于使动画变化更为平滑。默认值是 linear，表示动画从开始到结束都拥有同样的速度。
     * linear    动画从头到尾的速度是相同的
     * ease    动画速度逐渐变慢
     * ease-in    动画速度由慢到快
     * ease-out    动画速度由快到慢
     * ease-in-out    动画先加速到达中间点后减速到达终点
     * cubic-bezier(x1, y1, x2, y2)    在三次贝塞尔函数中定义变化过程，函数的参数值必须处于 0 到 1 之间
     */
    timingFunction?: string;

    /**
     * 节点动画执行时是否产生布局动画即LayoutAnimation，默认值是false。
     */
    needLayout?: boolean;
    /**
     * 指定请求动画操作到执行动画之间的时间间隔 (单位是毫秒)，默认值是 0，表示没有延迟，在请求后立即执行动画。
     */
    delay: number;
}

export function transition(el: Array<ReactNode>, style: React.CSSProperties, option: TransitionOptions, callback: () => void): void;


