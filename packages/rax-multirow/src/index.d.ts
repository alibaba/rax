import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 *多列布局
 *文档地址 https://alibaba.github.io/rax/component/multirow
 */
export interface MultiRowProps extends BaseProps {


    /**
     * 模板方法（必需）
     */
    renderCell: Function;
    /**
     * 需要渲染的数据，与 renderCell 配合使用（必需）
     */
    dataSource: Array<any>;

    /**
     * 每行包含几列，默认1列（必需）
     */
    cells?: Number;

}

declare class MultiRow extends Rax.Component<MultiRowProps, any> {

    render(): JSX.Element;
}

export default MultiRow;
