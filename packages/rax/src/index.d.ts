import * as React from "react";
import {ReactChildren, ReactHTMLElement, ReactInstance, ReactNode, ReactPropTypes} from "react";
import {HTMLAttributes} from "react";
import {SFCElement} from "react";
import {ClassicComponentClass} from "react";
import {ComponentState} from "react";
import {InputHTMLAttributes} from "react";
import {DetailedReactHTMLElement} from "react";
import {Attributes} from "react";
import {DOMElement} from "react";
import {ClassAttributes} from "react";
import {SVGAttributes} from "react";
import {SFC} from "react";
import {DOMAttributes} from "react";
import {ClassicComponent} from "react";
import {ClassType} from "react";
import {ComponentClass} from "react";
import {ReactSVG} from "react";
import {ReactElement} from "react";
import {ReactSVGElement} from "react";
import {ReactHTML} from "react";
import {CElement} from "react";
import {URL} from "url";
import {SFCFactory} from "react";
import {DOMFactory} from "react";
import {SVGFactory} from "react";
import {HTMLFactory} from "react";
import {CFactory} from "react";
import {Factory} from "react";
import {WeexModule} from "weex";

/**
 * rax type定义
 * 因为 rax 是react的实现之一，所以直接引用react的ts定义
 */
declare namespace Rax {


    /**
     * 更新者
     */
    interface Updater {
        /**
         * 更新的的部分状态
         * @param {Rax.Component} component 更新的组件
         * @param partialState   部分更新的状态
         * @param {Function} callback 回调函数
         */
        setState(component: React.Component, partialState: any, callback: Function): void;

        /**
         * 强制更新
         * @param {Rax.Component} component
         * @param {Function} callback
         */
        forceUpdate(component: React.Component, callback: Function): void

        /**
         * 更新
         * @param {Rax.Component} component
         */
        runUpdate(component: React.Component): void

        /**
         * 运行回调
         * @param {Function} callback
         */
        runCallbacks(callback: Function): void
    }


    class Component<P, S> extends React.Component<P, S> {
        /**
         *
         * @param {P} props
         * @param context
         * @param updater
         */
        constructor(props: P, context?: any, updater?: Updater);
    }

    /**
     * props 基类
     */
    interface BaseProps /*extends HTMLAttributes<any>*/ {


        /**
         * 样式
         */
        style?: React.CSSProperties;

        /**
         * className
         */
        className?: string;

        // /**
        //  * 点击事件
        //  * @param p
        //  */
        // onClick?: (p: Function) => void;
    }

    // DOM Elements
    function createFactory<T extends HTMLElement>(
        type: keyof ReactHTML): HTMLFactory<T>;
    function createFactory(
        type: keyof ReactSVG): SVGFactory;
    function createFactory<P extends DOMAttributes<T>, T extends Element>(
        type: string): DOMFactory<P, T>;

    // Custom components
    function createFactory<P>(type: SFC<P>): SFCFactory<P>;
    function createFactory<P>(
        type: ClassType<P, ClassicComponent<P, ComponentState>, ClassicComponentClass<P>>): CFactory<P, ClassicComponent<P, ComponentState>>;
    function createFactory<P, T extends Component<P, ComponentState>, C extends ComponentClass<P>>(
        type: ClassType<P, T, C>): CFactory<P, T>;
    function createFactory<P>(type: ComponentClass<P>): Factory<P>;

    // DOM Elements
    // TODO: generalize this to everything in `keyof ReactHTML`, not just "input"
    function createElement(type: "input",
                           props?: InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement> | null,
                           ...children: ReactNode[]): DetailedReactHTMLElement<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    function createElement<P extends HTMLAttributes<T>, T extends HTMLElement>(type: keyof ReactHTML,
                                                                               props?: ClassAttributes<T> & P | null,
                                                                               ...children: ReactNode[]): DetailedReactHTMLElement<P, T>;
    function createElement<P extends SVGAttributes<T>, T extends SVGElement>(type: keyof ReactSVG,
                                                                             props?: ClassAttributes<T> & P | null,
                                                                             ...children: ReactNode[]): ReactSVGElement;
    function createElement<P extends DOMAttributes<T>, T extends Element>(type: string,
                                                                          props?: ClassAttributes<T> & P | null,
                                                                          ...children: ReactNode[]): DOMElement<P, T>;

    // Custom components
    function createElement<P>(type: SFC<P>,
                              props?: Attributes & P | null,
                              ...children: ReactNode[]): SFCElement<P>;
    function createElement<P>(type: ClassType<P, ClassicComponent<P, ComponentState>, ClassicComponentClass<P>>,
                              props?: ClassAttributes<ClassicComponent<P, ComponentState>> & P | null,
                              ...children: ReactNode[]): CElement<P, ClassicComponent<P, ComponentState>>;
    function createElement<P, T extends Component<P, ComponentState>, C extends ComponentClass<P>>(type: ClassType<P, T, C>,
                                                                                                   props?: ClassAttributes<T> & P | null,
                                                                                                   ...children: ReactNode[]): CElement<P, T>;
    function createElement<P>(type: SFC<P> | ComponentClass<P> | string,
                              props?: Attributes & P | null,
                              ...children: ReactNode[]): ReactElement<P>;


    // DOM Elements
    // ReactHTMLElement
    function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
        element: DetailedReactHTMLElement<P, T>,
        props?: P,
        ...children: ReactNode[]): DetailedReactHTMLElement<P, T>;
    // ReactHTMLElement, less specific
    function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
        element: ReactHTMLElement<T>,
        props?: P,
        ...children: ReactNode[]): ReactHTMLElement<T>;
    // SVGElement
    function cloneElement<P extends SVGAttributes<T>, T extends SVGElement>(
        element: ReactSVGElement,
        props?: P,
        ...children: ReactNode[]): ReactSVGElement;
    // DOM Element (has to be the last, because type checking stops at first overload that fits)
    function cloneElement<P extends DOMAttributes<T>, T extends Element>(
        element: DOMElement<P, T>,
        props?: DOMAttributes<T> & P,
        ...children: ReactNode[]): DOMElement<P, T>;

    // Custom components
    function cloneElement<P extends Q, Q>(
        element: SFCElement<P>,
        props?: Q, // should be Q & Attributes, but then Q is inferred as {}
        ...children: ReactNode[]): SFCElement<P>;
    function cloneElement<P extends Q, Q, T extends Component<P, ComponentState>>(
        element: CElement<P, T>,
        props?: Q, // should be Q & ClassAttributes<T>
        ...children: ReactNode[]): CElement<P, T>;
    function cloneElement<P extends Q, Q>(
        element: ReactElement<P>,
        props?: Q, // should be Q & Attributes
        ...children: ReactNode[]): ReactElement<P>;

    function isValidElement<P>(object: {} | null | undefined): object is ReactElement<P>;

    function render(element: ReactNode, container?: ReactNode | string, options?: Function | object, callback?: Function): ReactInstance


    export function hydrate(element: ReactNode, container?: ReactNode | string, options?: Function | object, callback?: Function): ReactInstance;

    export function findDOMNode(instance: ReactInstance): React.Component;

    export function unmountComponentAtNode(container: ReactNode): boolean;


    /**
     * 查找组件的实例
     * @param {ReactNode}node
     * @return {Component}
     */
    function findComponentInstance(node: ReactNode): React.Component;

    export function setNativeProps(container: Element, props: any): boolean;

    const Children: ReactChildren;

    const version: string;

    const PropTypes: ReactPropTypes;
}


export = Rax;
export as namespace Rax;


declare global {


    /**
     * 页面重绘的回调事件，rax原生中使用 setTimeOut(()=>{},16)来模拟
     * @param {Function} callback
     * @return {string}
     */
    export function requestAnimationFrame(callback: Function): string;

    /**
     * 取消 requestAnimationFrame
     * @param {number} timerId
     */
    export function cancelAnimationFrame(timerId: number): void;

    /**
     * 弹出一个默认对话框
     * @param message
     */
    export function alert(message?: string): void;

    /**
     * 打开一个页面
     * @param {"url".URL} url
     */
    export function open(url: URL): void;


     //weex 相关

    /**
     * weex 模块支持判断，支持 模块名 或 模块名.方法名 例如    __weex_module_supports__(stream.fetch)
     * @param {string} name
     * @return {boolean}
     * @private
     */
    export function __weex_module_supports__(name: string): boolean;

    /**
     * 模块支持判断 仅支持模块名称 例如 __weex_module_supports__(stream)
     * 为了使用语义上的明确，建议使用 __weex_module_supports__
     * @param {string} moduleName 模块名称
     * @return {boolean}
     * @private
     */
    export function __weex_tag_supports__(moduleName: string): boolean;

    /**
     * weex 模块定义
     * @param {string} moduleName 模块名称
     * @return {T}
     * @private
     */
    export function __weex_define__<T extends WeexModule>(moduleName: string): T;

    /**
     * weex 模块定义
     * @param {string} moduleName 模块名称
     * @return {T}
     * @private
     */
    export function __weex_define__<T extends WeexModule>(moduleName: string): T;

    /**
     * weex 模块导入
     * @param {string} moduleName 模块名称
     * @return {T}
     * @private
     */
    export function __weex_require__<T extends WeexModule>(moduleName: string): T;


    /**
     *
     * weex 环境信息
     */
    export const __weex_env__: {
        /**
         * 平台
         */
        readonly  platform: string,
        /**
         * app名称
         */
        readonly  appName: string,
        /**
         * app版本
         */
        readonly  appVersion: string,
        /**
         * 操作系统版本
         */
        readonly    osVersion: string,
        /**
         * 设备名称（模式）
         */
        readonly   deviceModel: string,
        /**
         * weex sdk版本
         */
        readonly    weexVersion: string,
        /**
         * 日志版本
         */
        readonly  logLevel: string,
        /**
         * 设备宽
         */
        readonly  deviceWidth: number,
        /**
         * 设备高
         */
        readonly    deviceHeight: number,
        /**
         * 缩放比例
         */
        readonly   scale: number,

        readonly   ttid: string,

        readonly   utdid: string

    };


    /**
     * weex 实例编码，在创建实例（createInstance）是传入
     */
    export const __weex_code__: string;

    /**
     * weex配置项
     */
    export interface WeexOptions {
        bundleUrl: string;
        debug: boolean
    }

    /**
     * weex创建实例是传入的可选项
     */
    export const __weex_options__: WeexOptions;

    /**
     * weex 创建实例时传入的自定义对象
     */
    export const __weex_data__: any;

    /**
     * weex 全局配置
     */
    export type WeexConfig = {
        services: any
    }

    /**
     * weex 全局配置 创建实例时传入
     */
    export const __weex_config__: WeexConfig;


    /**
     * 设置原生的props
     * 不使用 state/props 的情况下，直接使用 setNativeProps 去触发重新渲染
     * @param {React.ReactNode} node
     * @param props
     */
    export function setNativeProps(node: ReactNode, props: any): void;

    //https://alibaba.github.io/rax/guide/network
    // export function fetch() {
    //
    // }
    //
    //
    // //https://alibaba.github.io/rax/guide/env-info
    // export const navigator: {
    //     readonly platform: string;
    //     readonly product: string;
    //     readonly appName: string;
    //     readonly  appVersion: string
    // };
    //
    // export const screen: {
    //     readonly width: number;
    //     readonly height: number;
    //     readonly availWidth: number;
    //     readonly availHeight: number;
    //     readonly colorDepth: number;
    //     readonly pixelDepth: number;
    // }
}



