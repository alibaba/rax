import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component：grid(栅格布局)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/grid
 */

export interface RowProps extends BaseProps {

    /**
     * grid type
     */
    gridType?: string;

}

export class Row extends Rax.Component<RowProps, any> {

    render(): JSX.Element;
}

export interface ColProps extends BaseProps {

}

export class Col extends Rax.Component<ColProps, any> {

    render(): JSX.Element;
}

