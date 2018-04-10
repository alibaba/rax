import * as Rax from "rax";
import {BaseProps} from "rax";

export interface TouchableProps extends BaseProps {

    /**
     * 点击事件
     * @param p
     */
    onPress?: (p: Function) => void;


}

declare class Touchable extends Rax.Component<TouchableProps, any> {

    render(): JSX.Element;
}

export default Touchable;
