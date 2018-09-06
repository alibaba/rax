import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component:(文本输入)
 * document(文档地址)：
 * https://alibaba.github.io/rax/component/text-input
 */
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


export interface InputEvent extends ChangeEvent {

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
    readonly originalEvent: InputEvent;
}

/**
 * onChange 事件的event
 */
export interface TextInputChangeEvent extends BaseEvent {
    readonly originalEvent: ChangeEvent;
}


export type TextInputKeyboardType = "default" | "ascii-capable" | "numbers-and-punctuation" | "url" | "number-pad" | "phone-pad"
    | "name-phone-pad" | "email_address" | "decimal_pad" | "twitter" | "web-search" | "numeric"

export interface TextInputProps extends BaseProps {


    autoCapitalize?: string;

    autoCorrect?: boolean;

    /**
     * define this property text box to enter multiple lines of text Defaults to false
     * (定义该属性文本框可以输入多行文字)
     * default(默认值)：false
     */
    multiline?: boolean;

    /**
     * adding an element to an element
     * (为元素添加标识)
     */
    accessibilityLabel?: string;
    /**
     * add On AutoComplete feature
     * (添加开启自动完成功能)
     */
    autoComplete?: boolean;

    /**
     * add open to get focus
     * (添加开启获取焦点)
     */
    autoFocus?: boolean

    /**
     * can you edit
     * (是否可以编辑)
     * default(默认)：true
     */
    editable?: boolean

    /**
     * set which kind of soft keyboard pops up
     * (设置弹出哪种软键盘)
     */
    keyboardType?: TextInputKeyboardType;

    /**
     * set the maximum input value
     * (设置最大可输入值)
     */
    maxLength?: number;

    /**
     * set the maximum number of rows when the text box is mutiline
     * (当文本框为mutiline时设置最多的行数)
     */
    maxNumberOfLines?: number;

    /**
     * set the number of rows as above
     * (同上设置行数)
     */
    numberOfLines?: number;

    /**
     * set the number of rows as above
     * (设置文本框提示)
     */
    placeholder?: string

    /**
     * text box content password display
     * (文本框内容密码显示)
     */
    password?: boolean;

    /**
     * same as text box content password display
     * (同上文本框内容密码显示)
     */
    secureTextEntry?: boolean;

    /**
     * text content of the text box (controlled)
     * (文本框的文字内容 (受控))
     */
    value?: string

    /**
     * text content of the text box (uncontrolled)
     * (文本框的文字内容,[非受控])
     */
    defaultValue?: string;

    /**
     * this function is called when the text box is out of focus. onBlur={() => console.log('lost focus')}
     * (文本框失焦时调用此函数。onBlur={() => console.log('失焦啦')})
     * @param {TextInputFocusEvent} event
     */
    onBlur?: (event: TextInputFocusEvent) => void;

    /**
     * call this function when the textbox gets focus
     * (文本框获得焦点时调用此函数)
     * @param {TextInputFocusEvent} event
     */
    onFocus?: (event: TextInputFocusEvent) => void;

    /**
     * this function is called when the content of the text box changes (triggered when the user input completes. Usually after the blur event)
     * (文本框内容变化时调用此函数，[用户输入完成时触发。通常在 blur 事件之后])
     * @param {TextInputChangeEvent} event
     */
    onChange?: (event: TextInputChangeEvent) => void;

    /**
     * 文本框输入内容时调用此函数
     * (this function is called when the text box is input)
     * @param {TextInputEvent} event
     */
    onInput?: (event: TextInputEvent) => void;


}

declare class TextInput extends Rax.Component<TextInputProps, any> {

    render(): JSX.Element;

    /**
     * get focus method
     * (获取焦点方法)
     */
    focus: () => void;

    /**
     * failure of focus
     * (焦点失效)
     */
    blur: () => void;

    /**
     * clear input box contents
     * (清除输入框内容)
     */
    clear: () => void;

}

export default TextInput;
