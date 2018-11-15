/**
 * Toast(弹出框)
 * document address(文档地址)：
 * https://alibaba.github.io/rax/component/toast
 */
declare namespace Toast {

    /**
     * show popup
     * 显示弹出框
     * @param {string} message
     * @param {number} duration 默认值2000
     */
    function show(message: string, duration?: number): void;
}

export = Toast;
export as namespace Toast;
