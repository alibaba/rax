import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * 选择框
 * 文档地址：https://alibaba.github.io/rax/component/picker
 */
export interface PickerProps extends BaseProps {

    /**
     * 选中值
     */
    selectedValue: string;

    /**
     * 选项切换
     */
    onValueChange?: (value: string, items: Array<string>) => void;

}

export interface ItemProps {
    value: string,
    label: string,
    color?: string
}

declare class Item extends Rax.Component<ItemProps, any> {


    render(): JSX.Element;
}

declare class Picker extends Rax.Component<PickerProps, any> {

    public static Item: Item;

    render(): JSX.Element;
}

export default Picker;
