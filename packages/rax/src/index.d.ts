// Type definitions modified from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts
import * as CSS from 'csstype';
import * as PropTypes from 'prop-types';

type NativeAnimationEvent = AnimationEvent;
type NativeClipboardEvent = ClipboardEvent;
type NativeCompositionEvent = CompositionEvent;
type NativeDragEvent = DragEvent;
type NativeFocusEvent = FocusEvent;
type NativeKeyboardEvent = KeyboardEvent;
type NativeMouseEvent = MouseEvent;
type NativeTouchEvent = TouchEvent;
type NativePointerEvent = PointerEvent;
type NativeTransitionEvent = TransitionEvent;
type NativeUIEvent = UIEvent;
type NativeWheelEvent = WheelEvent;

// tslint:disable-next-line:export-just-namespace
export = Rax;
export as namespace Rax;

declare namespace Rax {
  //
  // Rax Elements
  // ----------------------------------------------------------------------

  type RaxType<P = any> =
    {
      [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never
    }[keyof JSX.IntrinsicElements] |
    ComponentType<P>;
  type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

  type Key = string | number;

  interface RefObject<T> {
    readonly current: T | null;
  }

  type Ref<T> = { bivarianceHack(instance: T | null): void }["bivarianceHack"] | RefObject<T> | null;
  type LegacyRef<T> = string | Ref<T>;

  type ComponentState = any;

  interface Attributes {
    key?: Key;
  }
  interface RefAttributes<T> extends Attributes {
    ref?: Ref<T>;
  }
  interface ClassAttributes<T> extends Attributes {
    ref?: LegacyRef<T>;
  }

  interface RaxElement<P> {
    type: string | ComponentClass<P> | FunctionComponent<P>;
    props: P;
    key: Key | null;
  }

  interface FunctionComponentElement<P> extends RaxElement<P> {
    type: FunctionComponent<P>;
    ref?: 'ref' extends keyof P ? P extends { ref?: infer R } ? R : never : never;
  }

  type CElement<P, T extends Component<P, ComponentState>> = ComponentElement<P, T>;
  interface ComponentElement<P, T extends Component<P, ComponentState>> extends RaxElement<P> {
    type: ComponentClass<P>;
    ref?: LegacyRef<T>;
  }

  type ClassicElement<P> = CElement<P, ClassicComponent<P, ComponentState>>;

  // string fallback for custom web-components
  interface DOMElement<P extends HTMLAttributes<T> | SVGAttributes<T>, T extends Element> extends RaxElement<P> {
    type: string;
    ref: LegacyRef<T>;
  }

  // RaxHTML for RaxHTMLElement
  // tslint:disable-next-line:no-empty-interface
  interface RaxHTMLElement<T extends HTMLElement> extends DetailedRaxHTMLElement<AllHTMLAttributes<T>, T> { }

  interface DetailedRaxHTMLElement<P extends HTMLAttributes<T>, T extends HTMLElement> extends DOMElement<P, T> {
    type: keyof RaxHTML;
  }

  // RaxSVG for RaxSVGElement
  interface RaxSVGElement extends DOMElement<SVGAttributes<SVGElement>, SVGElement> {
    type: keyof RaxSVG;
  }

  interface RaxPortal extends RaxElement<any> {
    key: Key | null;
    children: RaxNode;
  }

  //
  // Factories
  // ----------------------------------------------------------------------

  type Factory<P> = (props?: Attributes & P, ...children: RaxNode[]) => RaxElement<P>;

  type FunctionComponentFactory<P> = (props?: Attributes & P, ...children: RaxNode[]) => FunctionComponentElement<P>;

  type ComponentFactory<P, T extends Component<P, ComponentState>> =
    (props?: ClassAttributes<T> & P, ...children: RaxNode[]) => CElement<P, T>;

  type CFactory<P, T extends Component<P, ComponentState>> = ComponentFactory<P, T>;
  type ClassicFactory<P> = CFactory<P, ClassicComponent<P, ComponentState>>;

  type DOMFactory<P extends DOMAttributes<T>, T extends Element> =
    (props?: ClassAttributes<T> & P | null, ...children: RaxNode[]) => DOMElement<P, T>;

  // tslint:disable-next-line:no-empty-interface
  interface HTMLFactory<T extends HTMLElement> extends DetailedHTMLFactory<AllHTMLAttributes<T>, T> {}

  interface DetailedHTMLFactory<P extends HTMLAttributes<T>, T extends HTMLElement> extends DOMFactory<P, T> {
    (props?: ClassAttributes<T> & P | null, ...children: RaxNode[]): DetailedRaxHTMLElement<P, T>;
  }

  interface SVGFactory extends DOMFactory<SVGAttributes<SVGElement>, SVGElement> {
    (props?: ClassAttributes<SVGElement> & SVGAttributes<SVGElement> | null, ...children: RaxNode[]): RaxSVGElement;
  }

  //
  // Rax Nodes
  // ----------------------------------------------------------------------

  type RaxText = string | number;
  type RaxChild = RaxElement<any> | RaxText;

  interface RaxNodeArray extends Array<RaxNode> {}
  type RaxFragment = {} | RaxNodeArray;
  type RaxNode = RaxChild | RaxFragment | RaxPortal | boolean | null | undefined;

  //
  // Top Level API
  // ----------------------------------------------------------------------

  // DOM Elements
  function createFactory<T extends HTMLElement>(
    type: keyof RaxHTML): HTMLFactory<T>;
  function createFactory(
    type: keyof RaxSVG): SVGFactory;
  function createFactory<P extends DOMAttributes<T>, T extends Element>(
    type: string): DOMFactory<P, T>;

  // Custom components
  function createFactory<P>(type: FunctionComponent<P>): FunctionComponentFactory<P>;
  function createFactory<P>(
    type: ClassType<P, ClassicComponent<P, ComponentState>, ClassicComponentClass<P>>): CFactory<P, ClassicComponent<P, ComponentState>>;
  function createFactory<P, T extends Component<P, ComponentState>, C extends ComponentClass<P>>(
    type: ClassType<P, T, C>): CFactory<P, T>;
  function createFactory<P>(type: ComponentClass<P>): Factory<P>;

  // DOM Elements
  // TODO: generalize this to everything in `keyof RaxHTML`, not just "input"
  function createElement(
    type: "input",
    props?: InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement> | null,
    ...children: RaxNode[]): DetailedRaxHTMLElement<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
  function createElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
    type: keyof RaxHTML,
    props?: ClassAttributes<T> & P | null,
    ...children: RaxNode[]): DetailedRaxHTMLElement<P, T>;
  function createElement<P extends SVGAttributes<T>, T extends SVGElement>(
    type: keyof RaxSVG,
    props?: ClassAttributes<T> & P | null,
    ...children: RaxNode[]): RaxSVGElement;
  function createElement<P extends DOMAttributes<T>, T extends Element>(
    type: string,
    props?: ClassAttributes<T> & P | null,
    ...children: RaxNode[]): DOMElement<P, T>;

  // Custom components

  function createElement<P extends {}>(
    type: FunctionComponent<P>,
    props?: Attributes & P | null,
    ...children: RaxNode[]): FunctionComponentElement<P>;
  function createElement<P extends {}>(
    type: ClassType<P, ClassicComponent<P, ComponentState>, ClassicComponentClass<P>>,
    props?: ClassAttributes<ClassicComponent<P, ComponentState>> & P | null,
    ...children: RaxNode[]): CElement<P, ClassicComponent<P, ComponentState>>;
  function createElement<P extends {}, T extends Component<P, ComponentState>, C extends ComponentClass<P>>(
    type: ClassType<P, T, C>,
    props?: ClassAttributes<T> & P | null,
    ...children: RaxNode[]): CElement<P, T>;
  function createElement<P extends {}>(
    type: FunctionComponent<P> | ComponentClass<P> | string,
    props?: Attributes & P | null,
    ...children: RaxNode[]): RaxElement<P>;

  // DOM Elements
  // RaxHTMLElement
  function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
    element: DetailedRaxHTMLElement<P, T>,
    props?: P,
    ...children: RaxNode[]): DetailedRaxHTMLElement<P, T>;
  // RaxHTMLElement, less specific
  function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
    element: RaxHTMLElement<T>,
    props?: P,
    ...children: RaxNode[]): RaxHTMLElement<T>;
  // SVGElement
  function cloneElement<P extends SVGAttributes<T>, T extends SVGElement>(
    element: RaxSVGElement,
    props?: P,
    ...children: RaxNode[]): RaxSVGElement;
  // DOM Element (has to be the last, because type checking stops at first overload that fits)
  function cloneElement<P extends DOMAttributes<T>, T extends Element>(
    element: DOMElement<P, T>,
    props?: DOMAttributes<T> & P,
    ...children: RaxNode[]): DOMElement<P, T>;

  // Custom components
  function cloneElement<P>(
    element: FunctionComponentElement<P>,
    props?: Partial<P> & Attributes,
    ...children: RaxNode[]): FunctionComponentElement<P>;
  function cloneElement<P, T extends Component<P, ComponentState>>(
    element: CElement<P, T>,
    props?: Partial<P> & ClassAttributes<T>,
    ...children: RaxNode[]): CElement<P, T>;
  function cloneElement<P>(
    element: RaxElement<P>,
    props?: Partial<P> & Attributes,
    ...children: RaxNode[]): RaxElement<P>;

  // Context via RenderProps
  interface ProviderProps<T> {
    value: T;
    children?: RaxNode;
  }

  interface ConsumerProps<T> {
    children: (value: T) => RaxNode;
  }

  // TODO: similar to how Fragment is actually a symbol, the values returned from createContext,
  // forwardRef and memo are actually objects that are treated specially by the renderer; 
  // However, we have no way of telling the JSX parser that it's a JSX element type or its props other than
  // by pretending to be a normal component.
  //
  // We don't just use ComponentType or SFC types because you are not supposed to attach statics to this
  // object, but rather to the original function.
  interface ExoticComponent<P = {}> {
    /**
     * **NOTE**: Exotic components are not callable.
     */
    (props: P): (RaxElement<any>|null);
    readonly $$typeof: symbol;
  }

  interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
    displayName?: string;
  }

  interface ProviderExoticComponent<P> extends ExoticComponent<P> {
    propTypes?: ValidationMap<P>;
  }

  type ContextType<C extends Context<any>> = C extends Context<infer T> ? T : never;

  // NOTE: only the Context object itself can get a displayName
  type Provider<T> = ProviderExoticComponent<ProviderProps<T>>;
  type Consumer<T> = ExoticComponent<ConsumerProps<T>>;
  interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string;
  }
  function createContext<T>(
    defaultValue: T,
    calculateChangedBits?: (prev: T, next: T) => number
  ): Context<T>;

  function isValidElement<P>(object: {} | null | undefined): object is RaxElement<P>;

  const Children: RaxChildren;
  const Fragment: ExoticComponent<{ children?: RaxNode }>;
  /**
   * This feature is not yet available for server-side rendering.
   * Suspense support will be added in a later release.
   */
  const Suspense: ExoticComponent<{
    children?: RaxNode

    /** A fallback tree to show when a Suspense child (like Rax.lazy) suspends */
    fallback: NonNullable<RaxNode>|null
  }>;
  const version: string;

  //
  // Component API
  // ----------------------------------------------------------------------

  type RaxInstance = Component<any> | Element;

  // Base component for plain JS classes
  // tslint:disable-next-line:no-empty-interface
  interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> { }
  class Component<P, S> {
    // tslint won't let me format the sample code in a way that vscode likes it :(
    /**
     * If set, `this.context` will be set at runtime to the current value of the given Context.
     *
     * Usage:
     *
     * ```ts
     * type MyContext = number
     * const Ctx = Rax.createContext<MyContext>(0)
     *
     * class Foo extends Rax.Component {
     *   static contextType = Ctx
     *   context!: Rax.ContextType<typeof Ctx>
     *   render () {
     *   return <>My context's value: {this.context}</>;
     *   }
     * }
     * ```
     */
    static contextType?: Context<any>;

    /**
     * If using the new style context, re-declare this in your class to be the
     * `Rax.ContextType` of your `static contextType`.
     *
     * ```ts
     * static contextType = MyContext
     * context!: Rax.ContextType<typeof MyContext>
     * ```
     */
    // TODO (TypeScript 3.0): unknown
    context: any;

    constructor(props: Readonly<P>);

    constructor(props: P, context?: any);

    // We MUST keep setState() as a unified signature because it allows proper checking of the method return type.
    // See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18365#issuecomment-351013257
    // Also, the ` | S` allows intellisense to not be dumbisense
    setState<K extends keyof S>(
      state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;

    forceUpdate(callBack?: () => void): void;
    render(): RaxNode;

    // Rax.Props<T> is now deprecated, which means that the `children`
    // property is not available on `P` by default, even though you can
    // always pass children as variadic arguments to `createElement`.
    // In the future, if we can define its call signature conditionally
    // on the existence of `children` in `P`, then we should remove this.
    readonly props: Readonly<{ children?: RaxNode }> & Readonly<P>;
    state: Readonly<S>;
    /**
     * @deprecated
     */
    refs: {
      [key: string]: RaxInstance
    };
  }

  class PureComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> { }

  interface ClassicComponent<P = {}, S = {}> extends Component<P, S> {
    replaceState(nextState: S, callback?: () => void): void;
    isMounted(): boolean;
    getInitialState?(): S;
  }

  interface ChildContextProvider<CC> {
    getChildContext(): CC;
  }

  //
  // Class Interfaces
  // ----------------------------------------------------------------------

  type FC<P = {}> = FunctionComponent<P>;

  interface FunctionComponent<P = {}> {
    (props: P & { children?: RaxNode }, context?: any): RaxElement<any> | null;
    propTypes?: ValidationMap<P>;
    contextTypes?: ValidationMap<any>;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  interface RefForwardingComponent<T, P = {}> {
    (props: P & { children?: RaxNode }, ref: Ref<T> | null): RaxElement<any> | null;
    propTypes?: ValidationMap<P>;
    contextTypes?: ValidationMap<any>;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  interface ComponentClass<P = {}, S = ComponentState> extends StaticLifecycle<P, S> {
    new (props: P, context?: any): Component<P, S>;
    propTypes?: ValidationMap<P>;
    contextType?: Context<any>;
    contextTypes?: ValidationMap<any>;
    childContextTypes?: ValidationMap<any>;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  interface ClassicComponentClass<P = {}> extends ComponentClass<P> {
    new (props: P, context?: any): ClassicComponent<P, ComponentState>;
    getDefaultProps?(): P;
  }

  /**
   * We use an intersection type to infer multiple type parameters from
   * a single argument, which is useful for many top-level API defs.
   * See https://github.com/Microsoft/TypeScript/issues/7234 for more info.
   */
  type ClassType<P, T extends Component<P, ComponentState>, C extends ComponentClass<P>> =
    C &
    (new (props: P, context?: any) => T);

  //
  // Component Specs and Lifecycle
  // ----------------------------------------------------------------------

  // This should actually be something like `Lifecycle<P, S> | DeprecatedLifecycle<P, S>`,
  // as Rax will _not_ call the deprecated lifecycle methods if any of the new lifecycle
  // methods are present.
  interface ComponentLifecycle<P, S, SS = any> extends NewLifecycle<P, S, SS>, DeprecatedLifecycle<P, S> {
    /**
     * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
     */
    componentDidMount?(): void;
    /**
     * Called to determine whether the change in props and state should trigger a re-render.
     *
     * `Component` always returns true.
     * `PureComponent` implements a shallow comparison on props and state and returns true if any
     * props or states have changed.
     *
     * If false is returned, `Component#render`, `componentWillUpdate`
     * and `componentDidUpdate` will not be called.
     */
    shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;
    /**
     * Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
     * cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.
     */
    componentWillUnmount?(): void;
    /**
     * Catches exceptions generated in descendant components. Unhandled exceptions will cause
     * the entire component tree to unmount.
     */
    componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
  }

  // Unfortunately, we have no way of declaring that the component constructor must implement this
  interface StaticLifecycle<P, S> {
    getDerivedStateFromProps?: GetDerivedStateFromProps<P, S>;
    getDerivedStateFromError?: GetDerivedStateFromError<P, S>;
  }

  type GetDerivedStateFromProps<P, S> =
    /**
     * Returns an update to a component's state based on its new props and old state.
     *
     * Note: its presence prevents any of the deprecated lifecycle methods from being invoked
     */
    (nextProps: Readonly<P>, prevState: S) => Partial<S> | null;

  type GetDerivedStateFromError<P, S> =
    /**
     * This lifecycle is invoked after an error has been thrown by a descendant component.
     * It receives the error that was thrown as a parameter and should return a value to update state.
     *
     * Note: its presence prevents any of the deprecated lifecycle methods from being invoked
     */
    (error: any) => Partial<S> | null;

  // This should be "infer SS" but can't use it yet
  interface NewLifecycle<P, S, SS> {
    /**
     * Runs before Rax applies the result of `render` to the document, and
     * returns an object to be given to componentDidUpdate. Useful for saving
     * things such as scroll position before `render` causes changes to it.
     *
     * Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
     * lifecycle events from running.
     */
    getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): SS | null;
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     * The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.
     */
    componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void;
  }

  interface DeprecatedLifecycle<P, S> {
    /**
     * Called immediately before mounting occurs, and before `Component#render`.
     * Avoid introducing any side-effects or subscriptions in this method.
     *
     * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
     * prevents this from being invoked.
     */
    componentWillMount?(): void;
    /**
     * Called when the component may be receiving new props.
     * Rax may call this even if props have not changed, so be sure to compare new and existing
     * props if you only want to handle changes.
     *
     * Calling `Component#setState` generally does not trigger this method.
     *
     * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
     * prevents this from being invoked.
     */
    componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
    /**
     * Called immediately before rendering when new props or state is received. Not called for the initial render.
     *
     * Note: You cannot call `Component#setState` here.
     *
     * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
     * prevents this from being invoked.
     */
    componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
  }

  interface Mixin<P, S> extends ComponentLifecycle<P, S> {
    mixins?: Array<Mixin<P, S>>;
    statics?: {
      [key: string]: any;
    };

    displayName?: string;
    propTypes?: ValidationMap<any>;
    contextTypes?: ValidationMap<any>;
    childContextTypes?: ValidationMap<any>;

    getDefaultProps?(): P;
    getInitialState?(): S;
  }

  interface ComponentSpec<P, S> extends Mixin<P, S> {
    render(): RaxNode;

    [propertyName: string]: any;
  }

  function createRef<T>(): RefObject<T>;

  // will show `ForwardRef(${Component.displayName || Component.name})` in devtools by default,
  // but can be given its own specific name
  interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {
    defaultProps?: Partial<P>;
  }

  function forwardRef<T, P = {}>(Component: RefForwardingComponent<T, P>): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

  /** Ensures that the props do not include ref at all */
  type PropsWithoutRef<P> =
    // Just Pick would be sufficient for this, but I'm trying to avoid unnecessary mapping over union types
    // https://github.com/Microsoft/TypeScript/issues/28339
    'ref' extends keyof P
      ? Pick<P, Exclude<keyof P, 'ref'>>
      : P;
  /** Ensures that the props do not include string ref, which cannot be forwarded */
  type PropsWithRef<P> =
    // Just "P extends { ref?: infer R }" looks sufficient, but R will infer as {} if P is {}.
    'ref' extends keyof P
      ? P extends { ref?: infer R }
        ? string extends R
          ? PropsWithoutRef<P> & { ref?: Exclude<R, string> }
          : P
        : P
      : P;

  /**
   * NOTE: prefer ComponentPropsWithRef, if the ref is forwarded,
   * or ComponentPropsWithoutRef when refs are not supported.
   */
  type ComponentProps<T extends RaxType> =
    T extends ComponentType<infer P>
      ? P
      : T extends keyof JSX.IntrinsicElements
        ? JSX.IntrinsicElements[T]
        : {};
  type ComponentPropsWithRef<T extends RaxType> =
    T extends ComponentClass<infer P>
      ? PropsWithoutRef<P> & RefAttributes<InstanceType<T>>
      : PropsWithRef<ComponentProps<T>>;
  type ComponentPropsWithoutRef<T extends RaxType> =
    PropsWithoutRef<ComponentProps<T>>;

  // will show `Memo(${Component.displayName || Component.name})` in devtools by default,
  // but can be given its own specific name
  interface MemoExoticComponent<T extends ComponentType<any>> extends NamedExoticComponent<ComponentPropsWithRef<T>> {
    readonly type: T;
  }

  function memo<P extends object>(
    Component: SFC<P>,
    propsAreEqual?: (prevProps: Readonly<P & { children?: RaxNode }>, nextProps: Readonly<P & { children?: RaxNode }>) => boolean
  ): NamedExoticComponent<P>;
  function memo<T extends ComponentType<any>>(
    Component: T,
    propsAreEqual?: (prevProps: Readonly<ComponentProps<T>>, nextProps: Readonly<ComponentProps<T>>) => boolean
  ): MemoExoticComponent<T>;

  interface LazyExoticComponent<T extends ComponentType<any>> extends ExoticComponent<ComponentPropsWithRef<T>> {
    readonly _result: T;
  }

  function lazy<T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>
  ): LazyExoticComponent<T>;

  //
  // Rax Hooks
  // ----------------------------------------------------------------------

  // Unlike the class component setState, the updates are not allowed to be partial
  type SetStateAction<S> = S | ((prevState: S) => S);
  // this technically does accept a second argument, but it's already under a deprecation warning
  // and it's not even released so probably better to not define it.
  type Dispatch<A> = (value: A) => void;
  // Unlike redux, the actions _can_ be anything
  type Reducer<S, A> = (prevState: S, action: A) => S;
  // The identity check is done with the SameValue algorithm (Object.is), which is stricter than ===
  // TODO (TypeScript 3.0): ReadonlyArray<unknown>
  type InputIdentityList = ReadonlyArray<any>;

  // NOTE: Currently, in alpha.0, the effect callbacks are actually allowed to return anything,
  // but functions are treated specially. The next version published with hooks will warn if you actually
  // return anything besides `void` or a callback. Async effects need to call an async function inside
  // them.
  type EffectCallback = () => (void | (() => void));

  interface MutableRefObject<T> {
    current: T;
  }

  // This will technically work if you give a Consumer<T> or Provider<T> but it's deprecated and warns
  /**
   * Accepts a context object (the value returned from `Rax.createContext`) and returns the current
   * context value, as given by the nearest context provider for the given context.
   *
   * @version experimental
   */
  function useContext<T>(context: Context<T>/*, (not public API) observedBits?: number|boolean */): T;
  /**
   * Returns a stateful value, and a function to update it.
   *
   * @version experimental
   */
  function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  /**
   * An alternative to `useState`.
   *
   * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
   * multiple sub-values. It also lets you optimize performance for components that trigger deep
   * updates because you can pass `dispatch` down instead of callbacks.
   *
   * @version experimental
   */
  function useReducer<S, A>(reducer: Reducer<S, A>, initialState: S, initialAction?: A | null): [S, Dispatch<A>];
  /**
   * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
   * (`initialValue`). The returned object will persist for the full lifetime of the component.
   *
   * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
   * value around similar to how you’d use instance fields in classes.
   *
   * @version experimental
   */
  // TODO (TypeScript 3.0): <T extends unknown>
  function useRef<T>(initialValue: T): MutableRefObject<T>;
  // convenience overload for refs given as a ref prop as they typically start with a null value
  /**
   * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
   * (`initialValue`). The returned object will persist for the full lifetime of the component.
   *
   * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
   * value around similar to how you’d use instance fields in classes.
   *
   * Usage note: if you need the result of useRef to be directly mutable, include `| null` in the type
   * of the generic argument.
   *
   * @version experimental
   */
  // TODO (TypeScript 3.0): <T extends unknown>
  function useRef<T>(initialValue: T|null): RefObject<T>;
  /**
   * The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations.
   * Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside
   * `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.
   *
   * Prefer the standard `useEffect` when possible to avoid blocking visual updates.
   *
   * If you’re migrating code from a class component, `useLayoutEffect` fires in the same phase as
   * `componentDidMount` and `componentDidUpdate`.
   *
   * @version experimental
   */
  function useLayoutEffect(effect: EffectCallback, inputs?: InputIdentityList): void;
  /**
   * Accepts a function that contains imperative, possibly effectful code.
   *
   * @param effect Imperative function that can return a cleanup function
   * @param inputs If present, effect will only activate if the values in the list change.
   *
   * @version experimental
   */
  function useEffect(effect: EffectCallback, inputs?: InputIdentityList): void;
  // NOTE: this does not accept strings, but this will have to be fixed by removing strings from type Ref<T>
  /**
   * `useImperativeHandle` customizes the instance value that is exposed to parent components when using
   * `ref`. As always, imperative code using refs should be avoided in most cases.
   *
   * `useImperativeHandle` should be used with `Rax.forwardRef`.
   *
   * @version experimental
   */
  function useImperativeHandle<T, R extends T>(ref: Ref<T>|undefined, init: () => R, inputs?: InputIdentityList): void;
  // I made 'inputs' required here and in useMemo as there's no point to memoizing without the memoization key
  // useCallback(X) is identical to just using X, useMemo(() => Y) is identical to just using Y.
  /**
   * `useCallback` will return a memoized version of the callback that only changes if one of the `inputs`
   * has changed.
   *
   * @version experimental
   */
  // TODO (TypeScript 3.0): <T extends (...args: never[]) => unknown>
  function useCallback<T extends (...args: any[]) => any>(callback: T, inputs: InputIdentityList): T;
  /**
   * `useMemo` will only recompute the memoized value when one of the `inputs` has changed.
   *
   * Usage note: if calling `useMemo` with a referentially stable function, also give it as the input in
   * the second argument.
   *
   * ```ts
   * function expensive () { ... }
   *
   * function Component () {
   *   const expensiveResult = useMemo(expensive, [expensive])
   *   return ...
   * }
   * ```
   *
   * @version experimental
   */
  function useMemo<T>(factory: () => T, inputs: InputIdentityList): T;

  //
  // Event System
  // ----------------------------------------------------------------------

  interface SyntheticEvent<T = Element> {
    bubbles: boolean;
    /**
     * A reference to the element on which the event listener is registered.
     */
    currentTarget: EventTarget & T;
    cancelable: boolean;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    nativeEvent: Event;
    preventDefault(): void;
    isDefaultPrevented(): boolean;
    stopPropagation(): void;
    isPropagationStopped(): boolean;
    persist(): void;
    // If you thought this should be `EventTarget & T`, see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/12239
    /**
     * A reference to the element from which the event was originally dispatched.
     * This might be a child element to the element on which the event listener is registered.
     *
     * @see currentTarget
     */
    target: EventTarget;
    timeStamp: number;
    type: string;
  }

  interface ClipboardEvent<T = Element> extends SyntheticEvent<T> {
    clipboardData: DataTransfer;
    nativeEvent: NativeClipboardEvent;
  }

  interface CompositionEvent<T = Element> extends SyntheticEvent<T> {
    data: string;
    nativeEvent: NativeCompositionEvent;
  }

  interface DragEvent<T = Element> extends MouseEvent<T> {
    dataTransfer: DataTransfer;
    nativeEvent: NativeDragEvent;
  }

  interface PointerEvent<T = Element> extends MouseEvent<T> {
    pointerId: number;
    pressure: number;
    tiltX: number;
    tiltY: number;
    width: number;
    height: number;
    pointerType: 'mouse' | 'pen' | 'touch';
    isPrimary: boolean;
    nativeEvent: NativePointerEvent;
  }

  interface FocusEvent<T = Element> extends SyntheticEvent<T> {
    nativeEvent: NativeFocusEvent;
    relatedTarget: EventTarget;
    target: EventTarget & T;
  }

  // tslint:disable-next-line:no-empty-interface
  interface FormEvent<T = Element> extends SyntheticEvent<T> {
  }

  interface InvalidEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }

  interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }

  interface KeyboardEvent<T = Element> extends SyntheticEvent<T> {
    altKey: boolean;
    charCode: number;
    ctrlKey: boolean;
    /**
     * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
     */
    getModifierState(key: string): boolean;
    /**
     * See the [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values). for possible values
     */
    key: string;
    keyCode: number;
    locale: string;
    location: number;
    metaKey: boolean;
    nativeEvent: NativeKeyboardEvent;
    repeat: boolean;
    shiftKey: boolean;
    which: number;
  }

  interface MouseEvent<T = Element> extends SyntheticEvent<T> {
    altKey: boolean;
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    /**
     * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
     */
    getModifierState(key: string): boolean;
    metaKey: boolean;
    nativeEvent: NativeMouseEvent;
    pageX: number;
    pageY: number;
    relatedTarget: EventTarget;
    screenX: number;
    screenY: number;
    shiftKey: boolean;
  }

  interface TouchEvent<T = Element> extends SyntheticEvent<T> {
    altKey: boolean;
    changedTouches: TouchList;
    ctrlKey: boolean;
    /**
     * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
     */
    getModifierState(key: string): boolean;
    metaKey: boolean;
    nativeEvent: NativeTouchEvent;
    shiftKey: boolean;
    targetTouches: TouchList;
    touches: TouchList;
  }

  interface UIEvent<T = Element> extends SyntheticEvent<T> {
    detail: number;
    nativeEvent: NativeUIEvent;
    view: AbstractView;
  }

  interface WheelEvent<T = Element> extends MouseEvent<T> {
    deltaMode: number;
    deltaX: number;
    deltaY: number;
    deltaZ: number;
    nativeEvent: NativeWheelEvent;
  }

  interface AnimationEvent<T = Element> extends SyntheticEvent<T> {
    animationName: string;
    elapsedTime: number;
    nativeEvent: NativeAnimationEvent;
    pseudoElement: string;
  }

  interface TransitionEvent<T = Element> extends SyntheticEvent<T> {
    elapsedTime: number;
    nativeEvent: NativeTransitionEvent;
    propertyName: string;
    pseudoElement: string;
  }

  //
  // Event Handler Types
  // ----------------------------------------------------------------------

  type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }["bivarianceHack"];

  type RaxEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;

  type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;
  type CompositionEventHandler<T = Element> = EventHandler<CompositionEvent<T>>;
  type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
  type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
  type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
  type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
  type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
  type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
  type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
  type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;
  type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
  type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;
  type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;
  type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;

  //
  // Props / DOM Attributes
  // ----------------------------------------------------------------------

  /**
   * @deprecated. This was used to allow clients to pass `ref` and `key`
   * to `createElement`, which is no longer necessary due to intersection
   * types. If you need to declare a props object before passing it to
   * `createElement` or a factory, use `ClassAttributes<T>`:
   *
   * ```ts
   * var b: Button | null;
   * var props: ButtonProps & ClassAttributes<Button> = {
   *   ref: b => button = b, // ok!
   *   label: "I'm a Button"
   * };
   * ```
   */
  interface Props<T> {
    children?: RaxNode;
    key?: Key;
    ref?: LegacyRef<T>;
  }

  interface HTMLProps<T> extends AllHTMLAttributes<T>, ClassAttributes<T> {
  }

  type DetailedHTMLProps<E extends HTMLAttributes<T>, T> = ClassAttributes<T> & E;

  interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {
  }

  interface DOMAttributes<T> {
    children?: RaxNode;
    dangerouslySetInnerHTML?: {
      __html: string;
    };

    // Clipboard Events
    onCopy?: ClipboardEventHandler<T>;
    onCopyCapture?: ClipboardEventHandler<T>;
    onCut?: ClipboardEventHandler<T>;
    onCutCapture?: ClipboardEventHandler<T>;
    onPaste?: ClipboardEventHandler<T>;
    onPasteCapture?: ClipboardEventHandler<T>;

    // Composition Events
    onCompositionEnd?: CompositionEventHandler<T>;
    onCompositionEndCapture?: CompositionEventHandler<T>;
    onCompositionStart?: CompositionEventHandler<T>;
    onCompositionStartCapture?: CompositionEventHandler<T>;
    onCompositionUpdate?: CompositionEventHandler<T>;
    onCompositionUpdateCapture?: CompositionEventHandler<T>;

    // Focus Events
    onFocus?: FocusEventHandler<T>;
    onFocusCapture?: FocusEventHandler<T>;
    onBlur?: FocusEventHandler<T>;
    onBlurCapture?: FocusEventHandler<T>;

    // Form Events
    onChange?: FormEventHandler<T>;
    onChangeCapture?: FormEventHandler<T>;
    onInput?: FormEventHandler<T>;
    onInputCapture?: FormEventHandler<T>;
    onReset?: FormEventHandler<T>;
    onResetCapture?: FormEventHandler<T>;
    onSubmit?: FormEventHandler<T>;
    onSubmitCapture?: FormEventHandler<T>;
    onInvalid?: FormEventHandler<T>;
    onInvalidCapture?: FormEventHandler<T>;

    // Image Events
    onLoad?: RaxEventHandler<T>;
    onLoadCapture?: RaxEventHandler<T>;
    onError?: RaxEventHandler<T>; // also a Media Event
    onErrorCapture?: RaxEventHandler<T>; // also a Media Event

    // Keyboard Events
    onKeyDown?: KeyboardEventHandler<T>;
    onKeyDownCapture?: KeyboardEventHandler<T>;
    onKeyPress?: KeyboardEventHandler<T>;
    onKeyPressCapture?: KeyboardEventHandler<T>;
    onKeyUp?: KeyboardEventHandler<T>;
    onKeyUpCapture?: KeyboardEventHandler<T>;

    // Media Events
    onAbort?: RaxEventHandler<T>;
    onAbortCapture?: RaxEventHandler<T>;
    onCanPlay?: RaxEventHandler<T>;
    onCanPlayCapture?: RaxEventHandler<T>;
    onCanPlayThrough?: RaxEventHandler<T>;
    onCanPlayThroughCapture?: RaxEventHandler<T>;
    onDurationChange?: RaxEventHandler<T>;
    onDurationChangeCapture?: RaxEventHandler<T>;
    onEmptied?: RaxEventHandler<T>;
    onEmptiedCapture?: RaxEventHandler<T>;
    onEncrypted?: RaxEventHandler<T>;
    onEncryptedCapture?: RaxEventHandler<T>;
    onEnded?: RaxEventHandler<T>;
    onEndedCapture?: RaxEventHandler<T>;
    onLoadedData?: RaxEventHandler<T>;
    onLoadedDataCapture?: RaxEventHandler<T>;
    onLoadedMetadata?: RaxEventHandler<T>;
    onLoadedMetadataCapture?: RaxEventHandler<T>;
    onLoadStart?: RaxEventHandler<T>;
    onLoadStartCapture?: RaxEventHandler<T>;
    onPause?: RaxEventHandler<T>;
    onPauseCapture?: RaxEventHandler<T>;
    onPlay?: RaxEventHandler<T>;
    onPlayCapture?: RaxEventHandler<T>;
    onPlaying?: RaxEventHandler<T>;
    onPlayingCapture?: RaxEventHandler<T>;
    onProgress?: RaxEventHandler<T>;
    onProgressCapture?: RaxEventHandler<T>;
    onRateChange?: RaxEventHandler<T>;
    onRateChangeCapture?: RaxEventHandler<T>;
    onSeeked?: RaxEventHandler<T>;
    onSeekedCapture?: RaxEventHandler<T>;
    onSeeking?: RaxEventHandler<T>;
    onSeekingCapture?: RaxEventHandler<T>;
    onStalled?: RaxEventHandler<T>;
    onStalledCapture?: RaxEventHandler<T>;
    onSuspend?: RaxEventHandler<T>;
    onSuspendCapture?: RaxEventHandler<T>;
    onTimeUpdate?: RaxEventHandler<T>;
    onTimeUpdateCapture?: RaxEventHandler<T>;
    onVolumeChange?: RaxEventHandler<T>;
    onVolumeChangeCapture?: RaxEventHandler<T>;
    onWaiting?: RaxEventHandler<T>;
    onWaitingCapture?: RaxEventHandler<T>;

    // MouseEvents
    onClick?: MouseEventHandler<T>;
    onClickCapture?: MouseEventHandler<T>;
    onContextMenu?: MouseEventHandler<T>;
    onContextMenuCapture?: MouseEventHandler<T>;
    onDoubleClick?: MouseEventHandler<T>;
    onDoubleClickCapture?: MouseEventHandler<T>;
    onDrag?: DragEventHandler<T>;
    onDragCapture?: DragEventHandler<T>;
    onDragEnd?: DragEventHandler<T>;
    onDragEndCapture?: DragEventHandler<T>;
    onDragEnter?: DragEventHandler<T>;
    onDragEnterCapture?: DragEventHandler<T>;
    onDragExit?: DragEventHandler<T>;
    onDragExitCapture?: DragEventHandler<T>;
    onDragLeave?: DragEventHandler<T>;
    onDragLeaveCapture?: DragEventHandler<T>;
    onDragOver?: DragEventHandler<T>;
    onDragOverCapture?: DragEventHandler<T>;
    onDragStart?: DragEventHandler<T>;
    onDragStartCapture?: DragEventHandler<T>;
    onDrop?: DragEventHandler<T>;
    onDropCapture?: DragEventHandler<T>;
    onMouseDown?: MouseEventHandler<T>;
    onMouseDownCapture?: MouseEventHandler<T>;
    onMouseEnter?: MouseEventHandler<T>;
    onMouseLeave?: MouseEventHandler<T>;
    onMouseMove?: MouseEventHandler<T>;
    onMouseMoveCapture?: MouseEventHandler<T>;
    onMouseOut?: MouseEventHandler<T>;
    onMouseOutCapture?: MouseEventHandler<T>;
    onMouseOver?: MouseEventHandler<T>;
    onMouseOverCapture?: MouseEventHandler<T>;
    onMouseUp?: MouseEventHandler<T>;
    onMouseUpCapture?: MouseEventHandler<T>;

    // Selection Events
    onSelect?: RaxEventHandler<T>;
    onSelectCapture?: RaxEventHandler<T>;

    // Touch Events
    onTouchCancel?: TouchEventHandler<T>;
    onTouchCancelCapture?: TouchEventHandler<T>;
    onTouchEnd?: TouchEventHandler<T>;
    onTouchEndCapture?: TouchEventHandler<T>;
    onTouchMove?: TouchEventHandler<T>;
    onTouchMoveCapture?: TouchEventHandler<T>;
    onTouchStart?: TouchEventHandler<T>;
    onTouchStartCapture?: TouchEventHandler<T>;

    // Pointer Events
    onPointerDown?: PointerEventHandler<T>;
    onPointerDownCapture?: PointerEventHandler<T>;
    onPointerMove?: PointerEventHandler<T>;
    onPointerMoveCapture?: PointerEventHandler<T>;
    onPointerUp?: PointerEventHandler<T>;
    onPointerUpCapture?: PointerEventHandler<T>;
    onPointerCancel?: PointerEventHandler<T>;
    onPointerCancelCapture?: PointerEventHandler<T>;
    onPointerEnter?: PointerEventHandler<T>;
    onPointerEnterCapture?: PointerEventHandler<T>;
    onPointerLeave?: PointerEventHandler<T>;
    onPointerLeaveCapture?: PointerEventHandler<T>;
    onPointerOver?: PointerEventHandler<T>;
    onPointerOverCapture?: PointerEventHandler<T>;
    onPointerOut?: PointerEventHandler<T>;
    onPointerOutCapture?: PointerEventHandler<T>;
    onGotPointerCapture?: PointerEventHandler<T>;
    onGotPointerCaptureCapture?: PointerEventHandler<T>;
    onLostPointerCapture?: PointerEventHandler<T>;
    onLostPointerCaptureCapture?: PointerEventHandler<T>;

    // UI Events
    onScroll?: UIEventHandler<T>;
    onScrollCapture?: UIEventHandler<T>;

    // Wheel Events
    onWheel?: WheelEventHandler<T>;
    onWheelCapture?: WheelEventHandler<T>;

    // Animation Events
    onAnimationStart?: AnimationEventHandler<T>;
    onAnimationStartCapture?: AnimationEventHandler<T>;
    onAnimationEnd?: AnimationEventHandler<T>;
    onAnimationEndCapture?: AnimationEventHandler<T>;
    onAnimationIteration?: AnimationEventHandler<T>;
    onAnimationIterationCapture?: AnimationEventHandler<T>;

    // Transition Events
    onTransitionEnd?: TransitionEventHandler<T>;
    onTransitionEndCapture?: TransitionEventHandler<T>;
  }

  export interface CSSProperties extends CSS.Properties<string | number> {
    /**
     * The index signature was removed to enable closed typing for style
     * using CSSType. You're able to use type assertion or module augmentation
     * to add properties or an index signature of your own.
     *
     * For examples and more information, visit:
     * https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
     */
  }

  interface HTMLAttributes<T> extends DOMAttributes<T> {
    // Rax-specific Attributes
    defaultChecked?: boolean;
    defaultValue?: string | string[];
    suppressContentEditableWarning?: boolean;
    suppressHydrationWarning?: boolean;

    // Standard HTML Attributes
    accessKey?: string;
    className?: string;
    contentEditable?: boolean;
    contextMenu?: string;
    dir?: string;
    draggable?: boolean;
    hidden?: boolean;
    id?: string;
    lang?: string;
    placeholder?: string;
    slot?: string;
    spellCheck?: boolean;
    style?: CSSProperties;
    tabIndex?: number;
    title?: string;

    // Unknown
    inputMode?: string;
    is?: string;
    radioGroup?: string; // <command>, <menuitem>

    // WAI-ARIA
    role?: string;

    // RDFa Attributes
    about?: string;
    datatype?: string;
    inlist?: any;
    prefix?: string;
    property?: string;
    resource?: string;
    typeof?: string;
    vocab?: string;

    // Non-standard Attributes
    autoCapitalize?: string;
    autoCorrect?: string;
    autoSave?: string;
    color?: string;
    itemProp?: string;
    itemScope?: boolean;
    itemType?: string;
    itemID?: string;
    itemRef?: string;
    results?: number;
    security?: string;
    unselectable?: 'on' | 'off';
  }

  // All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
    'aria-activedescendant'?: string;
    /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
    'aria-atomic'?: boolean | 'false' | 'true';
    /**
     * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
     * presented if they are made.
     */
    'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both';
    /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
    'aria-busy'?: boolean | 'false' | 'true';
    /**
     * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
     * @see aria-pressed @see aria-selected.
     */
    'aria-checked'?: boolean | 'false' | 'mixed' | 'true';
    /**
     * Defines the total number of columns in a table, grid, or treegrid.
     * @see aria-colindex.
     */
    'aria-colcount'?: number;
    /**
     * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
     * @see aria-colcount @see aria-colspan.
     */
    'aria-colindex'?: number;
    /**
     * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-colindex @see aria-rowspan.
     */
    'aria-colspan'?: number;
    /**
     * Identifies the element (or elements) whose contents or presence are controlled by the current element.
     * @see aria-owns.
     */
    'aria-controls'?: string;
    /** Indicates the element that represents the current item within a container or set of related elements. */
    'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time';
    /**
     * Identifies the element (or elements) that describes the object.
     * @see aria-labelledby
     */
    'aria-describedby'?: string;
    /**
     * Identifies the element that provides a detailed, extended description for the object.
     * @see aria-describedby.
     */
    'aria-details'?: string;
    /**
     * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
     * @see aria-hidden @see aria-readonly.
     */
    'aria-disabled'?: boolean | 'false' | 'true';
    /**
     * Indicates what functions can be performed when a dragged object is released on the drop target.
     * @deprecated in ARIA 1.1
     */
    'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup';
    /**
     * Identifies the element that provides an error message for the object.
     * @see aria-invalid @see aria-describedby.
     */
    'aria-errormessage'?: string;
    /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
    'aria-expanded'?: boolean | 'false' | 'true';
    /**
     * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
     * allows assistive technology to override the general default of reading in document source order.
     */
    'aria-flowto'?: string;
    /**
     * Indicates an element's "grabbed" state in a drag-and-drop operation.
     * @deprecated in ARIA 1.1
     */
    'aria-grabbed'?: boolean | 'false' | 'true';
    /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
    'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    /**
     * Indicates whether the element is exposed to an accessibility API.
     * @see aria-disabled.
     */
    'aria-hidden'?: boolean | 'false' | 'true';
    /**
     * Indicates the entered value does not conform to the format expected by the application.
     * @see aria-errormessage.
     */
    'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
    /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
    'aria-keyshortcuts'?: string;
    /**
     * Defines a string value that labels the current element.
     * @see aria-labelledby.
     */
    'aria-label'?: string;
    /**
     * Identifies the element (or elements) that labels the current element.
     * @see aria-describedby.
     */
    'aria-labelledby'?: string;
    /** Defines the hierarchical level of an element within a structure. */
    'aria-level'?: number;
    /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
    'aria-live'?: 'off' | 'assertive' | 'polite';
    /** Indicates whether an element is modal when displayed. */
    'aria-modal'?: boolean | 'false' | 'true';
    /** Indicates whether a text box accepts multiple lines of input or only a single line. */
    'aria-multiline'?: boolean | 'false' | 'true';
    /** Indicates that the user may select more than one item from the current selectable descendants. */
    'aria-multiselectable'?: boolean | 'false' | 'true';
    /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
    'aria-orientation'?: 'horizontal' | 'vertical';
    /**
     * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
     * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
     * @see aria-controls.
     */
    'aria-owns'?: string;
    /**
     * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
     * A hint could be a sample value or a brief description of the expected format.
     */
    'aria-placeholder'?: string;
    /**
     * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-setsize.
     */
    'aria-posinset'?: number;
    /**
     * Indicates the current "pressed" state of toggle buttons.
     * @see aria-checked @see aria-selected.
     */
    'aria-pressed'?: boolean | 'false' | 'mixed' | 'true';
    /**
     * Indicates that the element is not editable, but is otherwise operable.
     * @see aria-disabled.
     */
    'aria-readonly'?: boolean | 'false' | 'true';
    /**
     * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
     * @see aria-atomic.
     */
    'aria-relevant'?: 'additions' | 'additions text' | 'all' | 'removals' | 'text';
    /** Indicates that user input is required on the element before a form may be submitted. */
    'aria-required'?: boolean | 'false' | 'true';
    /** Defines a human-readable, author-localized description for the role of an element. */
    'aria-roledescription'?: string;
    /**
     * Defines the total number of rows in a table, grid, or treegrid.
     * @see aria-rowindex.
     */
    'aria-rowcount'?: number;
    /**
     * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
     * @see aria-rowcount @see aria-rowspan.
     */
    'aria-rowindex'?: number;
    /**
     * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-rowindex @see aria-colspan.
     */
    'aria-rowspan'?: number;
    /**
     * Indicates the current "selected" state of various widgets.
     * @see aria-checked @see aria-pressed.
     */
    'aria-selected'?: boolean | 'false' | 'true';
    /**
     * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-posinset.
     */
    'aria-setsize'?: number;
    /** Indicates if items in a table or grid are sorted in ascending or descending order. */
    'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
    /** Defines the maximum allowed value for a range widget. */
    'aria-valuemax'?: number;
    /** Defines the minimum allowed value for a range widget. */
    'aria-valuemin'?: number;
    /**
     * Defines the current value for a range widget.
     * @see aria-valuetext.
     */
    'aria-valuenow'?: number;
    /** Defines the human readable text alternative of aria-valuenow for a range widget. */
    'aria-valuetext'?: string;
  }

  interface AllHTMLAttributes<T> extends HTMLAttributes<T> {
    // Standard HTML Attributes
    accept?: string;
    acceptCharset?: string;
    action?: string;
    allowFullScreen?: boolean;
    allowTransparency?: boolean;
    alt?: string;
    as?: string;
    async?: boolean;
    autoComplete?: string;
    autoFocus?: boolean;
    autoPlay?: boolean;
    capture?: boolean | string;
    cellPadding?: number | string;
    cellSpacing?: number | string;
    charSet?: string;
    challenge?: string;
    checked?: boolean;
    cite?: string;
    classID?: string;
    cols?: number;
    colSpan?: number;
    content?: string;
    controls?: boolean;
    coords?: string;
    crossOrigin?: string;
    data?: string;
    dateTime?: string;
    default?: boolean;
    defer?: boolean;
    disabled?: boolean;
    download?: any;
    encType?: string;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    frameBorder?: number | string;
    headers?: string;
    height?: number | string;
    high?: number;
    href?: string;
    hrefLang?: string;
    htmlFor?: string;
    httpEquiv?: string;
    integrity?: string;
    keyParams?: string;
    keyType?: string;
    kind?: string;
    label?: string;
    list?: string;
    loop?: boolean;
    low?: number;
    manifest?: string;
    marginHeight?: number;
    marginWidth?: number;
    max?: number | string;
    maxLength?: number;
    media?: string;
    mediaGroup?: string;
    method?: string;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    muted?: boolean;
    name?: string;
    nonce?: string;
    noValidate?: boolean;
    open?: boolean;
    optimum?: number;
    pattern?: string;
    placeholder?: string;
    playsInline?: boolean;
    poster?: string;
    preload?: string;
    readOnly?: boolean;
    rel?: string;
    required?: boolean;
    reversed?: boolean;
    rows?: number;
    rowSpan?: number;
    sandbox?: string;
    scope?: string;
    scoped?: boolean;
    scrolling?: string;
    seamless?: boolean;
    selected?: boolean;
    shape?: string;
    size?: number;
    sizes?: string;
    span?: number;
    src?: string;
    srcDoc?: string;
    srcLang?: string;
    srcSet?: string;
    start?: number;
    step?: number | string;
    summary?: string;
    target?: string;
    type?: string;
    useMap?: string;
    value?: string | string[] | number;
    width?: number | string;
    wmode?: string;
    wrap?: string;
  }

  interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
    download?: any;
    href?: string;
    hrefLang?: string;
    media?: string;
    rel?: string;
    target?: string;
    type?: string;
  }

  // tslint:disable-next-line:no-empty-interface
  interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}

  interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
    alt?: string;
    coords?: string;
    download?: any;
    href?: string;
    hrefLang?: string;
    media?: string;
    rel?: string;
    shape?: string;
    target?: string;
  }

  interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
    href?: string;
    target?: string;
  }

  interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string;
  }

  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    autoFocus?: boolean;
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    type?: string;
    value?: string | string[] | number;
  }

  interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
    height?: number | string;
    width?: number | string;
  }

  interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
    span?: number;
    width?: number | string;
  }

  interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
    span?: number;
  }

  interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
    open?: boolean;
  }

  interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string;
    dateTime?: string;
  }

  interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
    open?: boolean;
  }

  interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
    height?: number | string;
    src?: string;
    type?: string;
    width?: number | string;
  }

  interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean;
    form?: string;
    name?: string;
  }

  interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
    acceptCharset?: string;
    action?: string;
    autoComplete?: string;
    encType?: string;
    method?: string;
    name?: string;
    noValidate?: boolean;
    target?: string;
  }

  interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
    manifest?: string;
  }

  interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
    allow?: string;
    allowFullScreen?: boolean;
    allowTransparency?: boolean;
    frameBorder?: number | string;
    height?: number | string;
    marginHeight?: number;
    marginWidth?: number;
    name?: string;
    sandbox?: string;
    scrolling?: string;
    seamless?: boolean;
    src?: string;
    srcDoc?: string;
    width?: number | string;
  }

  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    alt?: string;
    crossOrigin?: "anonymous" | "use-credentials" | "";
    decoding?: "async" | "auto" | "sync";
    height?: number | string;
    sizes?: string;
    src?: string;
    srcSet?: string;
    useMap?: string;
    width?: number | string;
  }

  interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string;
    dateTime?: string;
  }

  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    accept?: string;
    alt?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    capture?: boolean | string; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
    checked?: boolean;
    crossOrigin?: string;
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    height?: number | string;
    list?: string;
    max?: number | string;
    maxLength?: number;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    name?: string;
    pattern?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    size?: number;
    src?: string;
    step?: number | string;
    type?: string;
    value?: string | string[] | number;
    width?: number | string;

    onChange?: ChangeEventHandler<T>;
  }

  interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
    autoFocus?: boolean;
    challenge?: string;
    disabled?: boolean;
    form?: string;
    keyType?: string;
    keyParams?: string;
    name?: string;
  }

  interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
    form?: string;
    htmlFor?: string;
  }

  interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
    value?: string | string[] | number;
  }

  interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
    as?: string;
    crossOrigin?: string;
    href?: string;
    hrefLang?: string;
    integrity?: string;
    media?: string;
    rel?: string;
    sizes?: string;
    type?: string;
  }

  interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
    name?: string;
  }

  interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: string;
  }

  interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
    autoPlay?: boolean;
    controls?: boolean;
    controlsList?: string;
    crossOrigin?: string;
    loop?: boolean;
    mediaGroup?: string;
    muted?: boolean;
    playsinline?: boolean;
    preload?: string;
    src?: string;
  }

  interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
    charSet?: string;
    content?: string;
    httpEquiv?: string;
    name?: string;
  }

  interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
    form?: string;
    high?: number;
    low?: number;
    max?: number | string;
    min?: number | string;
    optimum?: number;
    value?: string | string[] | number;
  }

  interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string;
  }

  interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
    classID?: string;
    data?: string;
    form?: string;
    height?: number | string;
    name?: string;
    type?: string;
    useMap?: string;
    width?: number | string;
    wmode?: string;
  }

  interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
    reversed?: boolean;
    start?: number;
    type?: '1' | 'a' | 'A' | 'i' | 'I';
  }

  interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean;
    label?: string;
  }

  interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean;
    label?: string;
    selected?: boolean;
    value?: string | string[] | number;
  }

  interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
    form?: string;
    htmlFor?: string;
    name?: string;
  }

  interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
    name?: string;
    value?: string | string[] | number;
  }

  interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
    max?: number | string;
    value?: string | string[] | number;
  }

  interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
    async?: boolean;
    charSet?: string;
    crossOrigin?: string;
    defer?: boolean;
    integrity?: string;
    noModule?: boolean;
    nonce?: string;
    src?: string;
    type?: string;
  }

  interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
    autoComplete?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    form?: string;
    multiple?: boolean;
    name?: string;
    required?: boolean;
    size?: number;
    value?: string | string[] | number;
    onChange?: ChangeEventHandler<T>;
  }

  interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
    media?: string;
    sizes?: string;
    src?: string;
    srcSet?: string;
    type?: string;
  }

  interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
    media?: string;
    nonce?: string;
    scoped?: boolean;
    type?: string;
  }

  interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
    cellPadding?: number | string;
    cellSpacing?: number | string;
    summary?: string;
  }

  interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
    autoComplete?: string;
    autoFocus?: boolean;
    cols?: number;
    dirName?: string;
    disabled?: boolean;
    form?: string;
    maxLength?: number;
    minLength?: number;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    rows?: number;
    value?: string | string[] | number;
    wrap?: string;

    onChange?: ChangeEventHandler<T>;
  }

  interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
    align?: "left" | "center" | "right" | "justify" | "char";
    colSpan?: number;
    headers?: string;
    rowSpan?: number;
    scope?: string;
  }

  interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
    align?: "left" | "center" | "right" | "justify" | "char";
    colSpan?: number;
    headers?: string;
    rowSpan?: number;
    scope?: string;
  }

  interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
    dateTime?: string;
  }

  interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
    default?: boolean;
    kind?: string;
    label?: string;
    src?: string;
    srcLang?: string;
  }

  interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
    height?: number | string;
    playsInline?: boolean;
    poster?: string;
    width?: number | string;
  }

  // this list is "complete" in that it contains every SVG attribute
  // that Rax supports, but the types can be improved.
  //
  // The three broad type categories are (in order of restrictiveness):
  //   - "number | string"
  //   - "string"
  //   - union of string literals
  interface SVGAttributes<T> extends DOMAttributes<T> {
    // Attributes which also defined in HTMLAttributes
    // See comment in SVGDOMPropertyConfig.js
    className?: string;
    color?: string;
    height?: number | string;
    id?: string;
    lang?: string;
    max?: number | string;
    media?: string;
    method?: string;
    min?: number | string;
    name?: string;
    style?: CSSProperties;
    target?: string;
    type?: string;
    width?: number | string;

    // Other HTML properties supported by SVG elements in browsers
    role?: string;
    tabIndex?: number;

    // SVG Specific attributes
    accentHeight?: number | string;
    accumulate?: "none" | "sum";
    additive?: "replace" | "sum";
    alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" |
    "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit";
    allowReorder?: "no" | "yes";
    alphabetic?: number | string;
    amplitude?: number | string;
    arabicForm?: "initial" | "medial" | "terminal" | "isolated";
    ascent?: number | string;
    attributeName?: string;
    attributeType?: string;
    autoReverse?: number | string;
    azimuth?: number | string;
    baseFrequency?: number | string;
    baselineShift?: number | string;
    baseProfile?: number | string;
    bbox?: number | string;
    begin?: number | string;
    bias?: number | string;
    by?: number | string;
    calcMode?: number | string;
    capHeight?: number | string;
    clip?: number | string;
    clipPath?: string;
    clipPathUnits?: number | string;
    clipRule?: number | string;
    colorInterpolation?: number | string;
    colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit";
    colorProfile?: number | string;
    colorRendering?: number | string;
    contentScriptType?: number | string;
    contentStyleType?: number | string;
    cursor?: number | string;
    cx?: number | string;
    cy?: number | string;
    d?: string;
    decelerate?: number | string;
    descent?: number | string;
    diffuseConstant?: number | string;
    direction?: number | string;
    display?: number | string;
    divisor?: number | string;
    dominantBaseline?: number | string;
    dur?: number | string;
    dx?: number | string;
    dy?: number | string;
    edgeMode?: number | string;
    elevation?: number | string;
    enableBackground?: number | string;
    end?: number | string;
    exponent?: number | string;
    externalResourcesRequired?: number | string;
    fill?: string;
    fillOpacity?: number | string;
    fillRule?: "nonzero" | "evenodd" | "inherit";
    filter?: string;
    filterRes?: number | string;
    filterUnits?: number | string;
    floodColor?: number | string;
    floodOpacity?: number | string;
    focusable?: number | string;
    fontFamily?: string;
    fontSize?: number | string;
    fontSizeAdjust?: number | string;
    fontStretch?: number | string;
    fontStyle?: number | string;
    fontVariant?: number | string;
    fontWeight?: number | string;
    format?: number | string;
    from?: number | string;
    fx?: number | string;
    fy?: number | string;
    g1?: number | string;
    g2?: number | string;
    glyphName?: number | string;
    glyphOrientationHorizontal?: number | string;
    glyphOrientationVertical?: number | string;
    glyphRef?: number | string;
    gradientTransform?: string;
    gradientUnits?: string;
    hanging?: number | string;
    horizAdvX?: number | string;
    horizOriginX?: number | string;
    href?: string;
    ideographic?: number | string;
    imageRendering?: number | string;
    in2?: number | string;
    in?: string;
    intercept?: number | string;
    k1?: number | string;
    k2?: number | string;
    k3?: number | string;
    k4?: number | string;
    k?: number | string;
    kernelMatrix?: number | string;
    kernelUnitLength?: number | string;
    kerning?: number | string;
    keyPoints?: number | string;
    keySplines?: number | string;
    keyTimes?: number | string;
    lengthAdjust?: number | string;
    letterSpacing?: number | string;
    lightingColor?: number | string;
    limitingConeAngle?: number | string;
    local?: number | string;
    markerEnd?: string;
    markerHeight?: number | string;
    markerMid?: string;
    markerStart?: string;
    markerUnits?: number | string;
    markerWidth?: number | string;
    mask?: string;
    maskContentUnits?: number | string;
    maskUnits?: number | string;
    mathematical?: number | string;
    mode?: number | string;
    numOctaves?: number | string;
    offset?: number | string;
    opacity?: number | string;
    operator?: number | string;
    order?: number | string;
    orient?: number | string;
    orientation?: number | string;
    origin?: number | string;
    overflow?: number | string;
    overlinePosition?: number | string;
    overlineThickness?: number | string;
    paintOrder?: number | string;
    panose1?: number | string;
    pathLength?: number | string;
    patternContentUnits?: string;
    patternTransform?: number | string;
    patternUnits?: string;
    pointerEvents?: number | string;
    points?: string;
    pointsAtX?: number | string;
    pointsAtY?: number | string;
    pointsAtZ?: number | string;
    preserveAlpha?: number | string;
    preserveAspectRatio?: string;
    primitiveUnits?: number | string;
    r?: number | string;
    radius?: number | string;
    refX?: number | string;
    refY?: number | string;
    renderingIntent?: number | string;
    repeatCount?: number | string;
    repeatDur?: number | string;
    requiredExtensions?: number | string;
    requiredFeatures?: number | string;
    restart?: number | string;
    result?: string;
    rotate?: number | string;
    rx?: number | string;
    ry?: number | string;
    scale?: number | string;
    seed?: number | string;
    shapeRendering?: number | string;
    slope?: number | string;
    spacing?: number | string;
    specularConstant?: number | string;
    specularExponent?: number | string;
    speed?: number | string;
    spreadMethod?: string;
    startOffset?: number | string;
    stdDeviation?: number | string;
    stemh?: number | string;
    stemv?: number | string;
    stitchTiles?: number | string;
    stopColor?: string;
    stopOpacity?: number | string;
    strikethroughPosition?: number | string;
    strikethroughThickness?: number | string;
    string?: number | string;
    stroke?: string;
    strokeDasharray?: string | number;
    strokeDashoffset?: string | number;
    strokeLinecap?: "butt" | "round" | "square" | "inherit";
    strokeLinejoin?: "miter" | "round" | "bevel" | "inherit";
    strokeMiterlimit?: number | string;
    strokeOpacity?: number | string;
    strokeWidth?: number | string;
    surfaceScale?: number | string;
    systemLanguage?: number | string;
    tableValues?: number | string;
    targetX?: number | string;
    targetY?: number | string;
    textAnchor?: string;
    textDecoration?: number | string;
    textLength?: number | string;
    textRendering?: number | string;
    to?: number | string;
    transform?: string;
    u1?: number | string;
    u2?: number | string;
    underlinePosition?: number | string;
    underlineThickness?: number | string;
    unicode?: number | string;
    unicodeBidi?: number | string;
    unicodeRange?: number | string;
    unitsPerEm?: number | string;
    vAlphabetic?: number | string;
    values?: string;
    vectorEffect?: number | string;
    version?: string;
    vertAdvY?: number | string;
    vertOriginX?: number | string;
    vertOriginY?: number | string;
    vHanging?: number | string;
    vIdeographic?: number | string;
    viewBox?: string;
    viewTarget?: number | string;
    visibility?: number | string;
    vMathematical?: number | string;
    widths?: number | string;
    wordSpacing?: number | string;
    writingMode?: number | string;
    x1?: number | string;
    x2?: number | string;
    x?: number | string;
    xChannelSelector?: string;
    xHeight?: number | string;
    xlinkActuate?: string;
    xlinkArcrole?: string;
    xlinkHref?: string;
    xlinkRole?: string;
    xlinkShow?: string;
    xlinkTitle?: string;
    xlinkType?: string;
    xmlBase?: string;
    xmlLang?: string;
    xmlns?: string;
    xmlnsXlink?: string;
    xmlSpace?: string;
    y1?: number | string;
    y2?: number | string;
    y?: number | string;
    yChannelSelector?: string;
    z?: number | string;
    zoomAndPan?: string;
  }

  interface WebViewHTMLAttributes<T> extends HTMLAttributes<T> {
    allowFullScreen?: boolean;
    allowpopups?: boolean;
    autoFocus?: boolean;
    autosize?: boolean;
    blinkfeatures?: string;
    disableblinkfeatures?: string;
    disableguestresize?: boolean;
    disablewebsecurity?: boolean;
    guestinstance?: string;
    httpreferrer?: string;
    nodeintegration?: boolean;
    partition?: string;
    plugins?: boolean;
    preload?: string;
    src?: string;
    useragent?: string;
    webpreferences?: string;
  }

  //
  // Rax.PropTypes
  // ----------------------------------------------------------------------

  type Validator<T> = PropTypes.Validator<T>;

  type Requireable<T> = PropTypes.Requireable<T>;

  type ValidationMap<T> = PropTypes.ValidationMap<T>;

  interface RaxPropTypes {
    any: typeof PropTypes.any;
    array: typeof PropTypes.array;
    bool: typeof PropTypes.bool;
    func: typeof PropTypes.func;
    number: typeof PropTypes.number;
    object: typeof PropTypes.object;
    string: typeof PropTypes.string;
    node: typeof PropTypes.node;
    element: typeof PropTypes.element;
    instanceOf: typeof PropTypes.instanceOf;
    oneOf: typeof PropTypes.oneOf;
    oneOfType: typeof PropTypes.oneOfType;
    arrayOf: typeof PropTypes.arrayOf;
    objectOf: typeof PropTypes.objectOf;
    shape: typeof PropTypes.shape;
    exact: typeof PropTypes.exact;
  }

  //
  // Rax.Children
  // ----------------------------------------------------------------------

  interface RaxChildren {
    map<T, C extends RaxElement<any>>(children: C[], fn: (child: C, index: number) => T): T[];
    map<T>(children: RaxNode, fn: (child: RaxChild, index: number) => T): T[];
    forEach(children: RaxNode, fn: (child: RaxChild, index: number) => void): void;
    count(children: RaxNode): number;
    only(children: RaxNode): RaxElement<any>;
    toArray(children: RaxNode): RaxChild[];
  }

  //
  // Browser Interfaces
  // https://github.com/nikeee/2048-typescript/blob/master/2048/js/touch.d.ts
  // ----------------------------------------------------------------------

  interface AbstractView {
    styleMedia: StyleMedia;
    document: Document;
  }

  interface Touch {
    identifier: number;
    target: EventTarget;
    screenX: number;
    screenY: number;
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
  }

  interface TouchList {
    [index: number]: Touch;
    length: number;
    item(index: number): Touch;
    identifiedTouch(identifier: number): Touch;
  }

  //
  // Error Interfaces
  // ----------------------------------------------------------------------
  interface ErrorInfo {
    /**
     * Captures which component contained the exception, and its ancestors.
     */
    componentStack: string;
  }
}

// Declared props take priority over inferred props
// If declared props have indexed properties, ignore inferred props entirely as keyof gets widened
type MergePropTypes<P, T> = P & Pick<T, Exclude<keyof T, keyof P>>;

// Any prop that has a default prop becomes optional, but its type is unchanged
// Undeclared default props are augmented into the resulting allowable attributes
// If declared props have indexed properties, ignore default props entirely as keyof gets widened
// Wrap in an outer-level conditional type to allow distribution over props that are unions
type Defaultize<P, D> = P extends any
  ? string extends keyof P ? P :
    & Pick<P, Exclude<keyof P, keyof D>>
    & Partial<Pick<P, Extract<keyof P, keyof D>>>
    & Partial<Pick<D, Exclude<keyof D, keyof P>>>
  : never;

type RaxManagedAttributes<C, P> = C extends { propTypes: infer T; defaultProps: infer D; }
  ? Defaultize<MergePropTypes<P, PropTypes.InferProps<T>>, D>
  : C extends { propTypes: infer T; }
    ? MergePropTypes<P, PropTypes.InferProps<T>>
    : C extends { defaultProps: infer D; }
      ? Defaultize<P, D>
      : P;

declare global {
  namespace JSX {
    // tslint:disable-next-line:no-empty-interface
    interface Element extends Rax.RaxElement<any> { }
    interface ElementClass extends Rax.Component<any> {
      render(): Rax.RaxNode;
    }
    interface ElementAttributesProperty { props: {}; }
    interface ElementChildrenAttribute { children: {}; }

    // We can't recurse forever because `type` can't be self-referential;
    // let's assume it's reasonable to do a single Rax.lazy() around a single Rax.memo() / vice-versa
    type LibraryManagedAttributes<C, P> = C extends Rax.MemoExoticComponent<infer T> | Rax.LazyExoticComponent<infer T>
      ? T extends Rax.MemoExoticComponent<infer U> | Rax.LazyExoticComponent<infer U>
        ? RaxManagedAttributes<U, P>
        : RaxManagedAttributes<T, P>
      : RaxManagedAttributes<C, P>;

    // tslint:disable-next-line:no-empty-interface
    interface IntrinsicAttributes extends Rax.Attributes { }
    // tslint:disable-next-line:no-empty-interface
    interface IntrinsicClassAttributes<T> extends Rax.ClassAttributes<T> { }

    interface IntrinsicElements {
      // HTML
      a: Rax.DetailedHTMLProps<Rax.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
      abbr: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      address: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      area: Rax.DetailedHTMLProps<Rax.AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
      article: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      aside: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      audio: Rax.DetailedHTMLProps<Rax.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
      b: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      base: Rax.DetailedHTMLProps<Rax.BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
      bdi: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      bdo: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      big: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      blockquote: Rax.DetailedHTMLProps<Rax.BlockquoteHTMLAttributes<HTMLElement>, HTMLElement>;
      body: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
      br: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
      button: Rax.DetailedHTMLProps<Rax.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      canvas: Rax.DetailedHTMLProps<Rax.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
      caption: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      cite: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      code: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      col: Rax.DetailedHTMLProps<Rax.ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
      colgroup: Rax.DetailedHTMLProps<Rax.ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
      data: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      datalist: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
      dd: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      del: Rax.DetailedHTMLProps<Rax.DelHTMLAttributes<HTMLElement>, HTMLElement>;
      details: Rax.DetailedHTMLProps<Rax.DetailsHTMLAttributes<HTMLElement>, HTMLElement>;
      dfn: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      dialog: Rax.DetailedHTMLProps<Rax.DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
      div: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      dl: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
      dt: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      em: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      embed: Rax.DetailedHTMLProps<Rax.EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
      fieldset: Rax.DetailedHTMLProps<Rax.FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
      figcaption: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      figure: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      footer: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      form: Rax.DetailedHTMLProps<Rax.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
      h1: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h2: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h3: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h4: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h5: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h6: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      head: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
      header: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      hgroup: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      hr: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
      html: Rax.DetailedHTMLProps<Rax.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
      i: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      iframe: Rax.DetailedHTMLProps<Rax.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
      img: Rax.DetailedHTMLProps<Rax.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
      input: Rax.DetailedHTMLProps<Rax.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      ins: Rax.DetailedHTMLProps<Rax.InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
      kbd: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      keygen: Rax.DetailedHTMLProps<Rax.KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
      label: Rax.DetailedHTMLProps<Rax.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
      legend: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
      li: Rax.DetailedHTMLProps<Rax.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
      link: Rax.DetailedHTMLProps<Rax.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
      main: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      map: Rax.DetailedHTMLProps<Rax.MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
      mark: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      menu: Rax.DetailedHTMLProps<Rax.MenuHTMLAttributes<HTMLElement>, HTMLElement>;
      menuitem: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      meta: Rax.DetailedHTMLProps<Rax.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
      meter: Rax.DetailedHTMLProps<Rax.MeterHTMLAttributes<HTMLElement>, HTMLElement>;
      nav: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      noindex: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      noscript: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      object: Rax.DetailedHTMLProps<Rax.ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
      ol: Rax.DetailedHTMLProps<Rax.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
      optgroup: Rax.DetailedHTMLProps<Rax.OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
      option: Rax.DetailedHTMLProps<Rax.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
      output: Rax.DetailedHTMLProps<Rax.OutputHTMLAttributes<HTMLElement>, HTMLElement>;
      p: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      param: Rax.DetailedHTMLProps<Rax.ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
      picture: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      pre: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
      progress: Rax.DetailedHTMLProps<Rax.ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
      q: Rax.DetailedHTMLProps<Rax.QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
      rp: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      rt: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      ruby: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      s: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      samp: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      script: Rax.DetailedHTMLProps<Rax.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
      section: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      select: Rax.DetailedHTMLProps<Rax.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
      small: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      source: Rax.DetailedHTMLProps<Rax.SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
      span: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      strong: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      style: Rax.DetailedHTMLProps<Rax.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
      sub: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      summary: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      sup: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      table: Rax.DetailedHTMLProps<Rax.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
      tbody: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      td: Rax.DetailedHTMLProps<Rax.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
      textarea: Rax.DetailedHTMLProps<Rax.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
      tfoot: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      th: Rax.DetailedHTMLProps<Rax.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
      thead: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      time: Rax.DetailedHTMLProps<Rax.TimeHTMLAttributes<HTMLElement>, HTMLElement>;
      title: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
      tr: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
      track: Rax.DetailedHTMLProps<Rax.TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
      u: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      ul: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
      "var": Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      video: Rax.DetailedHTMLProps<Rax.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
      wbr: Rax.DetailedHTMLProps<Rax.HTMLAttributes<HTMLElement>, HTMLElement>;
      webview: Rax.DetailedHTMLProps<Rax.WebViewHTMLAttributes<HTMLWebViewElement>, HTMLWebViewElement>;

      // SVG
      svg: Rax.SVGProps<SVGSVGElement>;

      animate: Rax.SVGProps<SVGElement>; // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
      animateTransform: Rax.SVGProps<SVGElement>; // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
      circle: Rax.SVGProps<SVGCircleElement>;
      clipPath: Rax.SVGProps<SVGClipPathElement>;
      defs: Rax.SVGProps<SVGDefsElement>;
      desc: Rax.SVGProps<SVGDescElement>;
      ellipse: Rax.SVGProps<SVGEllipseElement>;
      feBlend: Rax.SVGProps<SVGFEBlendElement>;
      feColorMatrix: Rax.SVGProps<SVGFEColorMatrixElement>;
      feComponentTransfer: Rax.SVGProps<SVGFEComponentTransferElement>;
      feComposite: Rax.SVGProps<SVGFECompositeElement>;
      feConvolveMatrix: Rax.SVGProps<SVGFEConvolveMatrixElement>;
      feDiffuseLighting: Rax.SVGProps<SVGFEDiffuseLightingElement>;
      feDisplacementMap: Rax.SVGProps<SVGFEDisplacementMapElement>;
      feDistantLight: Rax.SVGProps<SVGFEDistantLightElement>;
      feFlood: Rax.SVGProps<SVGFEFloodElement>;
      feFuncA: Rax.SVGProps<SVGFEFuncAElement>;
      feFuncB: Rax.SVGProps<SVGFEFuncBElement>;
      feFuncG: Rax.SVGProps<SVGFEFuncGElement>;
      feFuncR: Rax.SVGProps<SVGFEFuncRElement>;
      feGaussianBlur: Rax.SVGProps<SVGFEGaussianBlurElement>;
      feImage: Rax.SVGProps<SVGFEImageElement>;
      feMerge: Rax.SVGProps<SVGFEMergeElement>;
      feMergeNode: Rax.SVGProps<SVGFEMergeNodeElement>;
      feMorphology: Rax.SVGProps<SVGFEMorphologyElement>;
      feOffset: Rax.SVGProps<SVGFEOffsetElement>;
      fePointLight: Rax.SVGProps<SVGFEPointLightElement>;
      feSpecularLighting: Rax.SVGProps<SVGFESpecularLightingElement>;
      feSpotLight: Rax.SVGProps<SVGFESpotLightElement>;
      feTile: Rax.SVGProps<SVGFETileElement>;
      feTurbulence: Rax.SVGProps<SVGFETurbulenceElement>;
      filter: Rax.SVGProps<SVGFilterElement>;
      foreignObject: Rax.SVGProps<SVGForeignObjectElement>;
      g: Rax.SVGProps<SVGGElement>;
      image: Rax.SVGProps<SVGImageElement>;
      line: Rax.SVGProps<SVGLineElement>;
      linearGradient: Rax.SVGProps<SVGLinearGradientElement>;
      marker: Rax.SVGProps<SVGMarkerElement>;
      mask: Rax.SVGProps<SVGMaskElement>;
      metadata: Rax.SVGProps<SVGMetadataElement>;
      path: Rax.SVGProps<SVGPathElement>;
      pattern: Rax.SVGProps<SVGPatternElement>;
      polygon: Rax.SVGProps<SVGPolygonElement>;
      polyline: Rax.SVGProps<SVGPolylineElement>;
      radialGradient: Rax.SVGProps<SVGRadialGradientElement>;
      rect: Rax.SVGProps<SVGRectElement>;
      stop: Rax.SVGProps<SVGStopElement>;
      switch: Rax.SVGProps<SVGSwitchElement>;
      symbol: Rax.SVGProps<SVGSymbolElement>;
      text: Rax.SVGProps<SVGTextElement>;
      textPath: Rax.SVGProps<SVGTextPathElement>;
      tspan: Rax.SVGProps<SVGTSpanElement>;
      use: Rax.SVGProps<SVGUseElement>;
      view: Rax.SVGProps<SVGViewElement>;
    }
  }
}