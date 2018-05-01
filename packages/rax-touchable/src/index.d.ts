import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component:Touchable (可点击容器)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/touchable
 */

export interface TouchableProps extends BaseProps {

    /**
     * click event
     * (点击事件)
     * @param p
     */
    onPress?: (p: Function) => void;


}

declare class Touchable extends Rax.Component<TouchableProps, any> {

    render(): JSX.Element;
}

export default Touchable;
