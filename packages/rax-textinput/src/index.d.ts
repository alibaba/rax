import * as Rax from "rax";
import {KeyboardType} from "rax-enhance/textinput";
import * as React from "react";


interface InputDeviceCapabilities {

    readonly firesTouchEvents: boolean;
}

export interface TextInputNativeEvent {
    readonly text: string
}


export interface InputFocusEvent extends FocusEvent {
    readonly sourceCapabilities: InputDeviceCapabilities;
}


export interface ChangeEvent extends Event {
    readonly composed: boolean;
    readonly path: Array<Element>;
}


export interface InpuEvent extends ChangeEvent {

    readonly  data: string;
    readonly  dataTransfer: string;
    readonly detail: number;
    readonly inputType: string;
    readonly  isComposing: boolean;
    readonly sourceCapabilities: InputDeviceCapabilities;
}


export interface BaseEvent {
    readonly nativeEvent: any
    readonly target: Element;
    readonly value: string
}

/**
 * onFouces onBulr事件的event
 */
export interface TextInputFocusEvent extends BaseEvent {
    readonly originalEvent: InputFocusEvent;
}

/**
 * onInput 事件的evet
 */
export interface TextInputEvent extends BaseEvent {
    readonly originalEvent: InpuEvent;
}

/**
 * onChange 事件的event
 */
export interface TextInputChangeEvent extends BaseEvent {
    readonly originalEvent: ChangeEvent;
}


export interface TextInputProps {

    style?: React.CSSProperties;

    autoCapitalize?: string;

    autoCorrect?: boolean;

    /**
     * 定义该属性文本框可以输入多行文字 默认为false
     */
    multiline?: boolean;
    /**
     * 为元素添加标识
     */
    accessibilityLabel?: string;
    /**
     * 添加开启自动完成功能
     */
    autoComplete?: boolean;
    /**
     * 添加开启获取焦点
     */
    autoFocus?: boolean
    /**
     * 是否可以编辑
     * 默认为true 如果为fase则文本框不可编辑
     */
    editable?: boolean
    /**
     * 设置弹出哪种软键盘 可用的值有
     */
    keyboardType?: KeyboardType;
    /**
     * 设置最大可输入值
     */
    maxLength?: number;

    /**
     * 当文本框为mutiline时设置最多的行数
     */
    maxNumberOfLines?: number;
    /**
     * 同上设置行数
     */
    numberOfLines?: number;
    /**
     * 设置文本框提示
     */
    placeholder?: string
    /**
     * 文本框内容密码显示
     */
    password?: boolean;
    /**
     * 同上文本框内容密码显示
     */
    secureTextEntry?: boolean;
    /**
     * 文本框的文字内容 (受控)
     */
    value?: string
    /**
     * 文本框的文字内容（非受控）
     */
    defaultValue?: string;

    /**
     * 文本框失焦时调用此函数。onBlur={() => console.log('失焦啦')}
     * @param {TextInputFocusEvent} event
     */
    onBlur?: (event: TextInputFocusEvent) => void;

    /**
     * 文本框获得焦点时调用此函数
     * @param {TextInputFocusEvent} event
     */
    onFocus?: (event: TextInputFocusEvent) => void;

    /**
     * 文本框内容变化时调用此函数（用户输入完成时触发。通常在 blur 事件之后）
     * @param {TextInputChangeEvent} event
     */
    onChange?: (event: TextInputChangeEvent) => void;

    /**
     * 文本框输入内容时调用此函数
     * @param {TextInputEvent} event
     */
    onInput?: (event: TextInputEvent) => void;


}

declare class TextInput extends Rax.Component<TextInputProps, any> {

    render(): JSX.Element;

    /**
     * 获取焦点方法
     */
    focus: () => void;

    /**
     * 焦点失效
     */
    blur: () => void;

    /**
     * 清除输入框内容
     */
    clear: () => void;

}

export default TextInput;
