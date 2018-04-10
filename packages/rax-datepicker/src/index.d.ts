import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * 日期选择
 * 文档地址：https://alibaba.github.io/rax/component/datepicker
 */
export interface DatePickerProps extends BaseProps {

    /**
     * 选中值（示例：2017-01-01）
     */
    selectedValue: string
    /**
     *    日期切换
     */
    onDateChange?: (value: string) => void;
    /**
     * 日期选择最小范围（示例：2017-01-01）
     */
    minimumDate?: string
    /**
     * 日期选择最大范围（示例：2017-01-01）
     */
    maximumDate?: string

}

declare class DatePicker extends Rax.Component<DatePickerProps, any> {


    render(): JSX.Element;
}

export default DatePicker;
