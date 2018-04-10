import * as Rax from "rax";
import {BaseProps} from "rax";

export interface TextProps extends BaseProps {

    /**
     * 点击事件
     * @param p
     */
    onPress?: (p: Function) => void;

    /**
     * 指定行数
     */
    numberOfLines?: number;

}

declare class Text extends Rax.Component<TextProps, any> {

    render(): JSX.Element;
}

export default Text;
