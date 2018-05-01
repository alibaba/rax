import * as React from "react";

/**
 * Gesture processing (通用手势处理)
 * document address(文档地址):
 * https://alibaba.github.io/rax/guide/panresponder
 */

/**
 * Triggered gesture operation configuration
 * (触发的手势操作配置)
 */
export interface PanresponderConfig {

    /**
     * the function contains two parameters: event (event object) and gestureState (gesture state)
     * (函数中含有 event （事件对象）, gestureState （手势状态） 两个参数)
     */
    onMoveShouldSetPanResponder: (event: RaxEvent, gestureState: GestureState) => void;

    /**
     * the function contains two parameters: event (event object) and gestureState (gesture state)
     * (函数中含有 event （事件对象）, gestureState （手势状态） 两个参数)
     */
    onMoveShouldSetPanResponderCapture: (event: RaxEvent, gestureState: GestureState) => void;

    /**
     * the function contains two parameters: event (event object) and gestureState (gesture state)
     * (函数中含有 event （事件对象）, gestureState （手势状态） 两个参数)
     */
    onStartShouldSetPanResponder: (event: RaxEvent, gestureState: GestureState) => void;

    /**
     * the function contains two parameters: event (event object) and gestureState (gesture state)
     * (函数中含有 event （事件对象）, gestureState （手势状态） 两个参数)
     */
    onStartShouldSetPanResponderCapture: (event: RaxEvent, gestureState: GestureState) => void;

    /**
     * the function contains two parameters: event (event object) and gestureState (gesture state)
     * (函数中含有 event （事件对象）, gestureState （手势状态） 两个参数)
     */
    onPanResponderReject: (event: RaxEvent, gestureState: GestureState) => void;

    /**
     * the function contains two parameters: event (event object) and gestureState (gesture state)
     * (函数中含有 event （事件对象）, gestureState （手势状态） 两个参数)
     */
    onPanResponderGrant: (event: RaxEvent, gestureState: GestureState) => void;

    /**
     * the function contains two parameters: event (event object) and gestureState (gesture state)
     * (函数中含有 event （事件对象）, gestureState （手势状态） 两个参数)
     */
    onPanResponderStart: (event: RaxEvent, gestureState: GestureState) => void;

    /**
     * the function contains two parameters: event (event object) and gestureState (gesture state)
     * (函数中含有 event （事件对象）, gestureState （手势状态） 两个参数)
     */
    onPanResponderEnd: (event: RaxEvent, gestureState: GestureState) => void;

    /**
     * the function contains two parameters: event (event object) and gestureState (gesture state)
     * (函数中含有 event （事件对象）, gestureState （手势状态） 两个参数)
     */
    onPanResponderRelease: (event: RaxEvent, gestureState: GestureState) => void;

    /**
     * the function contains two parameters: event (event object) and gestureState (gesture state)
     * (函数中含有 event （事件对象）, gestureState （手势状态） 两个参数)
     */
    onPanResponderMove: (event: RaxEvent, gestureState: GestureState) => void;

    /**
     * the function contains two parameters: event (event object) and gestureState (gesture state)
     * (函数中含有 event （事件对象）, gestureState （手势状态） 两个参数)
     */
    onPanResponderTerminate: (event: RaxEvent, gestureState: GestureState) => void;

    /**
     * the function contains two parameters: event (event object) and gestureState (gesture state)
     * (函数中含有 event （事件对象）, gestureState （手势状态） 两个参数)
     */
    onPanResponderTerminationRequest: (event: RaxEvent, gestureState: GestureState) => void;

    /**
     * the function contains two parameters: event (event object) and gestureState (gesture state)
     * (函数中含有 event （事件对象）, gestureState （手势状态） 两个参数)
     */
    onShouldBlockNativeResponder: (event: RaxEvent, gestureState: GestureState) => void;

}

/**
 * attributes contained in the event object event
 * (事件对象 event 中包含的属性)
 */
export interface RaxEvent {

    /**
     * gesture changes array object
     * (手势变化的数组对象)
     */
    readonly changedTouches: Array<any>;

    /**
     * gesture id
     * (手势的 ID)
     */
    readonly identifier: number

    /**
     * the X coordinate of the gesture is related to the element
     * (手势的 X 坐标跟元素相关)
     */
    readonly locationX: number;

    /**
     * the Y coordinate of the gesture is related to the element
     * (手势的 Y 坐标跟元素相关)
     */
    readonly locationY: number;

    /**
     * the X coordinate of the gesture is related to the root node
     * (手势的 X 坐标跟根节点相关)
     */
    readonly pageX: number;

    /**
     * the Y coordinate of the gesture is related to the root node
     * (手势的 Y 坐标跟根节点相关)
     */
    readonly pageY: Number

    /**
     * accepts the elements of the touch event
     * 接受 touch 事件的元素
     */
    readonly target: React.ReactNode;

    /**
     * gesture timestamp
     * (手势的时间戳)
     */
    readonly timestamp: number;

    /**
     * all current touch events on the screen
     * (目前屏幕上的所有 touch 事件)
     */
    readonly touches: Array<any>;
}

/**
 * gesture Status Attributes contained in gestureState
 * (手势状态 gestureState 中包含的属性)
 */
export interface GestureState {

    /**
     * gesture status ID
     * (手势状态的 ID)
     */
    readonly stateID: Array<string | number>

    /**
     * recent screen coordinates of the latest mobile touch screen
     * (最近移动触摸屏的最新屏幕坐标)
     */
    readonly moveX: number;

    /**
     * recent screen coordinates of the latest mobile touch screen
     * (最近移动触摸屏的最新屏幕坐标)
     */
    readonly moveY: number;

    /**
     * gesture response screen coordinates
     * (手势响应的屏幕坐标)
     */
    readonly x0: number;

    /**
     * gesture response screen coordinates
     * (手势响应的屏幕坐标)
     */
    readonly y0: number;

    /**
     * gesture distance
     * (手势距离)
     */
    readonly  dx: number;

    /**
     * gesture distance
     * (手势距离)
     */
    readonly dy: number;

    /**
     * gesture speed
     * (手势速度)
     */
    readonly vx: number;

    /**
     * gesture speed
     * (手势速度)
     */
    readonly  vy: number;

    /**
     * Current screen touch event
     * (目前屏幕上的 touch 事件)
     */
    readonly  numberActiveTouches: Array<any>;

}

/**
 * native or h5
 * (原生端或h5端)
 */
export interface PanHandler {

    onTouchStart: (event: RaxEvent) => void;

    onTouchMove: (event: RaxEvent) => void;

    onTouchEnd: (event: RaxEvent) => void;
}

/**
 * pc web
 */
export interface WbePanHandler {

    onMouseDown: (event: RaxEvent) => void;

    onMouseMove: (event: RaxEvent) => void;

    onMouseUp: (event: RaxEvent) => void;
}

export function create(config: PanresponderConfig): PanHandler | WbePanHandler
