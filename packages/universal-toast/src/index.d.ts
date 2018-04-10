/**
 * Toast 弹出框
 * https://alibaba.github.io/rax/component/toast
 */
declare namespace Toast {
    /**
     * 显示弹出框
     * @param {string} message
     * @param {number} duration 默认值2000
     */
    function show(message: string, duration?: number): void;
}

export = Toast;
export as namespace Toast;
