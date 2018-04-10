import * as Rax from "rax";
import {BaseProps} from "rax";

export interface ViewProps extends BaseProps {}

declare class View extends Rax.Component<ViewProps, any> {

    render(): JSX.Element;
}

export default View;
