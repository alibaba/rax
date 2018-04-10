import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * 步进器
 * 文档地址：https://alibaba.github.io/rax/component/counter
 */
export interface CounterProps extends BaseProps {

    /**
     * 默认数值
     */
    value: number;
    /**
     * 起始值
     */
    start: number;
    /**
     * 终止值
     */
    end: number;
    /**
     * 改变值时触发
     */
    // onChange: (num:number) => void;
    /**
     * 渲染完成触发
     */
    onComplete?: (num:number) => void;

}

declare class Counter extends Rax.Component<CounterProps, any> {


    render(): JSX.Element;
}

export default Counter;
