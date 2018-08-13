import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component: counter(步进器)
 * document address(文档地址)：
 * https://alibaba.github.io/rax/component/counter
 */
export interface CounterProps extends BaseProps {

    /**
     * default value (默认数值)
     */
    value: number;

    /**
     * starting value (起始值)
     *
     */
    start: number;

    /**
     * end value (终止值)
     */
    end: number;

    /**
     * trigger on changing value (改变值时触发)
     * @param num
     */
    onChange: (num: number) => void;

    /**
     * render complete trigger (渲染完成触发)
     *  @param num
     */
    onComplete?: (num: number) => void;

}

declare class Counter extends Rax.Component<CounterProps, any> {


    render(): JSX.Element;
}

export default Counter;
