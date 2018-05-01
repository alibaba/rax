import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component: datepicker(日期选择)
 * document address(文档地址)：
 * https://alibaba.github.io/rax/component/datepicker
 */
export interface DatePickerProps extends BaseProps {

    /**
     * selected value (example: 2017-01-01) (选中值（示例：2017-01-01）)
     */
    selectedValue: string

    /**
     *  data change (日期切换)
     *  @param value
     */
    onDateChange?: (value: string) => void;

    /**
     * date selection minimum range (example: 2017-01-01) (日期选择最小范围[ 示例：2017-01-01 ])
     */
    minimumDate?: string

    /**
     * date Selection Maximum Range (Example: 2017-01-01) (日期选择最大范围[ 示例：2017-01-01 ])
     */
    maximumDate?: string

}

declare class DatePicker extends Rax.Component<DatePickerProps, any> {


    render(): JSX.Element;
}

export default DatePicker;
