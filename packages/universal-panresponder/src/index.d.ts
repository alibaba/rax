/**
 * 通用手势处理
 * 文档地址:https://alibaba.github.io/rax/guide/panresponder
 */
import * as React from "react";
import {Event} from "_debugger";

//触发的手势操作配置	否	无
export interface PanresponderConfig {

    /**
     * 函数中含有 event （事件对象）, gestureState （手势状态） 两个参数
     */
    onMoveShouldSetPanResponder: (event: RaxEvent, gestureState: GestureState) => void;
    /**
     * 函数中含有 event （事件对象）, gestureState （手势状态） 两个参数
     */
    onMoveShouldSetPanResponderCapture: (event: RaxEvent, gestureState: GestureState) => void;

    /**
     * 函数中含有 event （事件对象）, gestureState （手势状态） 两个参数
     */
    onStartShouldSetPanResponder: (event: RaxEvent, gestureState: GestureState) => void;

    /**
     * function    函数中含有 event （事件对象）, gestureState （手势状态） 两个参数
     */
    onStartShouldSetPanResponderCapture: (event: RaxEvent, gestureState: GestureState) => void;
    /**
     * 函数中含有 event （事件对象）, gestureState （手势状态） 两个参数
     */
    onPanResponderReject: (event: RaxEvent, gestureState: GestureState) => void;
    /**
     * 函数中含有 event （事件对象）, gestureState （手势状态） 两个参数
     */
    onPanResponderGrant: (event: RaxEvent, gestureState: GestureState) => void;
    /**
     * 函数中含有 event （事件对象）, gestureState （手势状态） 两个参数
     */
    onPanResponderStart: (event: RaxEvent, gestureState: GestureState) => void;
    /**
     * 函数中含有 event （事件对象）, gestureState （手势状态） 两个参数
     */
    onPanResponderEnd: (event: RaxEvent, gestureState: GestureState) => void;
    /**
     * 函数中含有 event （事件对象）, gestureState （手势状态） 两个参数
     */
    onPanResponderRelease: (event: RaxEvent, gestureState: GestureState) => void;
    /**
     * 函数中含有 event （事件对象）, gestureState （手势状态） 两个参数
     */
    onPanResponderMove: (event: RaxEvent, gestureState: GestureState) => void;
    /**
     * 函数中含有 event （事件对象）, gestureState （手势状态） 两个参数
     */
    onPanResponderTerminate: (event: RaxEvent, gestureState: GestureState) => void;
    /**
     * 函数中含有 event （事件对象）, gestureState （手势状态） 两个参数
     */
    onPanResponderTerminationRequest: (event: RaxEvent, gestureState: GestureState) => void;

    /**
     * 函数中含有 event （事件对象）, gestureState （手势状态） 两个参数
     */
    onShouldBlockNativeResponder: (event: RaxEvent, gestureState: GestureState) => void;

}

/**
 *
 * 事件对象 event 中包含的属性
 */
export interface RaxEvent {

    /**
     * 手势变化的数组对象
     */
    changedTouches: Array<any>;
    /**
     * 手势的 ID
     */
    identifier: number
    /**
     * 手势的 X 坐标跟元素相关
     */
    locationX: number;
    /**
     * 手势的 Y 坐标跟元素相关
     */
    locationY: number;
    /**
     *    手势的 X 坐标跟根节点相关
     */
    pageX: number;
    /**
     * 手势的 Y 坐标跟根节点相关
     */
    pageY: Number
    /**
     * 接受 touch 事件的元素
     */
    target: React.ReactNode;
    /**
     * 手势的时间戳
     */
    timestamp: number;
    /**
     * 目前屏幕上的所有 touch 事件
     */
    touches: Array<any>;
}

/**
 * 手势状态 gestureState 中包含的属性
 */
export interface GestureState {

    /**
     * 手势状态的 ID
     */
    stateID: Array<string | number>
    /**
     * 最近移动触摸屏的最新屏幕坐标
     */
    moveX: number;
    /**
     * 最近移动触摸屏的最新屏幕坐标
     */
    moveY: number;
    /**
     * 手势响应的屏幕坐标
     */
    x0: number;
    /**
     * 手势响应的屏幕坐标
     */
    y0: number;
    /**
     * 手势距离
     */
    dx: number;
    /**
     * 手势距离
     */
    dy: number;
    /**
     * 手势速度
     */
    vx: number;
    /**
     * 手势速度
     */

    vy: number;
    /**
     * 目前屏幕上的 touch 事件
     */
    numberActiveTouches: Array<any>;

}

/**
 * 原生端或h5端
 */
export interface PanHandler {

    onTouchStart: (event:RaxEvent) => void;

    onTouchMove: (event:RaxEvent) => void;

    onTouchEnd: (event:RaxEvent) => void;
}

/**
 * pc web端
 */
export interface WbePanHandler {

    onMouseDown: (event:RaxEvent) => void;

    onMouseMove: (event:RaxEvent) => void;

    onMouseUp: (event:RaxEvent) => void;
}

export function create(config: PanresponderConfig): PanHandler | WbePanHandler