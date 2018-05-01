import {default as React, ReactNode} from "react";

/**
 * Gradient animation(渐变动画)
 * document address(文档地址)：
 * https://alibaba.github.io/rax/component/transition
 * reference document(参考文档):https://weex.apache.org/cn/references/modules/animation.html
 */


/**
 * describes the speed curve that the animation performs to make the animation change smoother
 * (描述动画执行的速度曲线，用于使动画变化更为平滑)
 *
 * linear:
 * ease:
 *   slower animation speed
 *   (动画速度逐渐变慢)
 * ease-in:
 *     animation speed from
 *   The speed of the animation is the same from beginning to end
 *   (动画从头到尾的速度是相同的)slow to fast
 *    (动画速度由慢到快)
 * ease-out:
 *     animation speed from fast to slow
 *    (动画速度由快到慢)
 * ease-in-out:
 *    animation accelerates to the middle point and decelerates to the end
 *    (动画先加速到达中间点后减速到达终点)
 * cubic-bezier(x1, y1, x2, y2):
 *    The change process is defined in the cubic Bessel function. The parameter value of the function must be between 0 and 1
 *    (在三次贝塞尔函数中定义变化过程，函数的参数值必须处于 0 到 1 之间)
 */
export type TimingFunctionType =
    "linear"
    | "ease"
    | "ease-in"
    | "ease-out"
    | "ease-in-out"
    | "cubic-bezier(x1, y1, x2, y2)"


export interface TransitionOptions {

    /**
     * Specifies the duration of the animation (in milliseconds). The default value is 0, which means there is no animation
     * (指定动画的持续时间 (单位是毫秒)，默认值是 0，表示没有动画效果。)
     */
    duration: number;


    /**
     * describes the speed curve that the animation performs to make the animation change smoother
     * (描述动画执行的速度曲线，用于使动画变化更为平滑)
     * default(默认值)：linear
     */
    timingFunction?: TimingFunctionType;

    /**
     * whether or not to generate a layout animation when the reference node animation is executed is LayoutAnimation
     * (节点动画执行时是否产生布局动画即LayoutAnimation)
     * default(默认值)：false
     */
    needLayout?: boolean;

    /**
     * specifies the time interval (in milliseconds) between the request animation operation and the execution of the animation.
     * The default value is 0, which means there is no delay and the animation is executed immediately after the request.
     * (指定请求动画操作到执行动画之间的时间间隔 (单位是毫秒)，默认值是 0，表示没有延迟，在请求后立即执行动画)
     * default(默认值)：0
     */
    delay: number;
}

export function transition(el: ReactNode | Array<ReactNode>, style: React.CSSProperties, option: TransitionOptions, callback?: () => void): void;


