import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component:view(容器)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/view
 */
export interface ViewProps extends BaseProps {

}

declare class View extends Rax.Component<ViewProps, any> {

    render(): JSX.Element;
}

export default View;
