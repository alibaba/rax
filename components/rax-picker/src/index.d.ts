import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component: picker(选择框)
 * document address(文档地址)：
 * https://alibaba.github.io/rax/component/picker
 */
export interface PickerProps extends BaseProps {

    /**
     * selected value (选中值)
     */
    selectedValue: string;

    /**
     * option switch (选项切换)
     * @param {string} value
     * @param {number} index
     */
    onValueChange?: (value: string, index: number) => void;

}

/**
 * option props (选项的属性)
 */
export interface ItemProps {

    value: string,

    label: string,

    /**
     * tex color (文字颜色)
     */
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
