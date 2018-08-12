import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component: text(文本显示)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/text
 */
export interface TextProps extends BaseProps {

    /**
     * click event
     * @param p
     */
    onPress?: (p?: Function) => void;

    /**
     * specified number of rows
     * (指定行数)
     */
    numberOfLines?: number;

}

declare class Text extends Rax.Component<TextProps, any> {

    render(): JSX.Element;
}

export default Text;
