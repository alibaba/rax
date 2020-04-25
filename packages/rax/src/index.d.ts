import * as PropTypes from 'prop-types';
import "./jsx";

declare namespace Rax {
  //
  // Rax Element
  // -----------------------------------
  interface RaxElement<P> {
    type: string | Component<P> | ReactiveComponent<P>;
    props: P;
    key: Key | null;
    ref: Ref<any> | null;
  }

  function createElement(
    type: string,
    props: JSX.HTMLAttributes & JSX.SVGAttributes & Record<string, any> | null,
    ...children: ElementChildren[]
  ): RaxElement<any>;
  function createElement<P>(
    type: ComponentFactory<P>,
    props: Attributes & P | null,
    ...children: ElementChildren[]
  ): RaxElement<any>;

  function cloneElement(RaxElement: JSX.Element, props: any, ...children: ElementChildren[]): JSX.Element;


  type ElementType<P = any> =
    | {
        [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never
      }[keyof JSX.IntrinsicElements]
    | ComponentType<P>;

  type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

  interface RaxComponentElement<
    T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
    P = Pick<ComponentProps<T>, Exclude<keyof ComponentProps<T>, 'key' | 'ref'>>
  > extends RaxElement<P, T> {}

  interface FunctionComponentElement<P> extends RaxElement<P, FunctionComponent<P>> {
    ref?: 'ref' extends keyof P ? (P extends { ref?: infer R } ? R : never) : never;
  }


  type CElement<P, T extends Component<P, ComponentState>> = ComponentElement<P, T>;
  interface ComponentElement<P, T extends Component<P, ComponentState>>
    extends RaxElement<P, ComponentClass<P>> {
    ref?: LegacyRef<T>;
  }

  type ClassicElement<P> = CElement<P, ClassicComponent<P, ComponentState>>;
  interface ClassicComponent<P = {}, S = {}> extends Component<P, S> {
    replaceState(nextState: S, callback?: () => void): void;
    isMounted(): boolean;
    getInitialState?(): S;
  }

  //
  // Component interface
  // -----------------------------------

  type Key = string | number | any;

  type RefObject<T> = { current?: T | null }
  type RefCallback<T> = (instance: T | null) => void;
  type Ref<T> = RefObject<T> | RefCallback<T>;

  type ElementChild = RaxElement<any> | object | string | number | boolean | null | undefined;
  type ElementChildren = ElementChild[] | ElementChild;

  interface Attributes {
    key?: Key;
    jsx?: boolean;
  }

  interface ClassAttributes<T> extends Attributes {
    ref?: Ref<T>;
  }

  interface RaxDOMAttributes {
    children?: ElementChildren;
    dangerouslySetInnerHTML?: {
      __html: string;
    };
  }

  //
  // Rax.PropTypes
  // ----------------------------------------------------------------------

  type Validator<T> = PropTypes.Validator<T>;

  type Requireable<T> = PropTypes.Requireable<T>;

  type ValidationMap<T> = PropTypes.ValidationMap<T>;

  type WeakValidationMap<T> = {
    [K in keyof T]?: null extends T[K]
      ? Validator<T[K] | null | undefined>
      : undefined extends T[K]
      ? Validator<T[K] | null | undefined>
      : Validator<T[K]>
  };

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


  type RenderableProps<P, RefType = any> = Readonly<
    P & Attributes & { children?: ElementChildren; ref?: Ref<RefType> }
  >;

  type ComponentFactory<P = {}> = ComponentConstructor<P> | ReactiveComponent<P>;

  interface ReactiveComponent<P = {}> {
    (props: RenderableProps<P>, context?: any): RaxElement<any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }

  interface ComponentConstructor<P = {}, S = {}> {
    new (props: P, context?: any): Component<P, S>;
    displayName?: string;
    defaultProps?: Partial<P>;
    getDerivedStateFromProps?(props: Readonly<P>, state: Readonly<S>): Partial<S>;
    getDerivedStateFromError?(error: any): Partial<S>;
  }

  interface Component<P = {}, S = {}> {
    componentWillMount?(): void;
    componentDidMount?(): void;
    componentWillUnmount?(): void;
    getChildContext?(): object;
    componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
    shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;
    componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
    getSnapshotBeforeUpdate?(oldProps: Readonly<P>, oldState: Readonly<S>): any;
    componentDidUpdate?(previousProps: Readonly<P>, previousState: Readonly<S>, snapshot: any): void;
    componentDidCatch?(error: any): void;
  }

  abstract class Component<P, S> {
    constructor(props?: P, context?: any);

    static displayName?: string;
    static defaultProps?: any;
    static contextType?: RaxContext<any>;

    static getDerivedStateFromProps?(props: Readonly<object>, state: Readonly<object>): object;
    static getDerivedStateFromError?(error: any): object;

    state: Readonly<S>;
    props: RenderableProps<P>;
    context: any;
    base?: HTMLElement;

    setState<K extends keyof S>(
      state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;

    forceUpdate(callback?: () => void): void;

    abstract render(props?: RenderableProps<P>, state?: Readonly<S>, context?: any): ElementChildren;
  }

  class PureComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> {}
  type FC<P = {}> = FunctionComponent<P>;

  interface FunctionComponent<P = {}> {
    (props: PropsWithChildren<P>, context?: any): RaxElement | null;
    propTypes?: WeakValidationMap<P>;
    contextTypes?: ValidationMap<any>;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  //
  // Hooks
  // ----------------------------------------------------------------------

  function useContext<T>(context: RaxContext<T>): T;

  type SetStateAction<S> = (value: S | ((prevState: S) => S)) => void;
  function useState<S>(initialState: S | (() => S)): [S, SetStateAction<S>];
  function useState<S = undefined>(): [S | undefined, SetStateAction<S | undefined>];

  type Reducer<S, A> = (prevState: S, action: A) => S;
  function useReducer<S, A>(reducer: Reducer<S, A>, initialState: S): [S, (action: A) => void];
  function useReducer<S, A, I>(reducer: Reducer<S, A>, initialArg: I, init: (arg: I) => S): [S, (action: A) => void];

  type MutableRefObject<T> = { readonly current?: T; }
  function useRef<T>(initialValue: T|null): RefObject<T>;
  function useRef<T = unknown>(): MutableRefObject<T>;

  type EffectCallback = () => (void | (() => void));
  type DependencyList = ReadonlyArray<unknown>;
  function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;
  function useEffect(effect: EffectCallback, deps?: DependencyList): void;

  function useImperativeHandle<T, R extends T>(ref: Ref<T>|undefined, init: () => R, deps?: DependencyList): void;
  function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
  function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;

  //
  // Fragment
  // -----------------------------------
  const Fragment: ComponentConstructor<{}, {}>;

  //
  // Ref
  // -----------------------------------

  function createRef<T = any>(): RefObject<T>;
  function forwardRef<T, P = {}>(Component: ComponentFactory<P>): ComponentFactory<P>;

  //
  // Context
  // -----------------------------------
  interface RaxConsumer<T> extends ReactiveComponent<{
    children: (value: T) => ElementChildren
  }> {}

  interface RaxProvider<T> extends ReactiveComponent<{
    value: T,
    children: ElementChildren
  }> {}

  interface RaxContext<T> {
    Consumer: RaxConsumer<T>;
    Provider: RaxProvider<T>;
  }

  interface ChildContextProvider<CC> {
    getChildContext(): CC;
  }

  function createContext<T>(defaultValue: T): RaxContext<T>;

  //
  // render
  // -----------------------------------
  type RenderOption<T> = { driver?: T | null }
  function render(element: ElementChildren, parent: Element | Document | DocumentFragment, options?: RenderOption<T>, callback?: () => void): void

}

export default Rax;
