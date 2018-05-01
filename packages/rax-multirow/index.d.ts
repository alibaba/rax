import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component:multirow(多列布局)
 * document address(文档地址)：
 * https://alibaba.github.io/rax/component/multirow
 */
export interface MultiRowProps extends BaseProps {


    /**
     * template method
     * (模板方法)
     */
    renderCell: Function;

    /**
     * data to be rendered, used with renderCell (required)
     * (需要渲染的数据，与 renderCell 配合使用)
     */
    dataSource: Array<any>;

    /**
     * each row contains several columns, default 1 column
     * (每行包含几列，默认1列)
     */
    cells?: Number;

}

declare class MultiRow extends Rax.Component<MultiRowProps, any> {

    render(): JSX.Element;
}

export default MultiRow;
