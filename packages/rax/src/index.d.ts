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

  function createContext<T>(defaultValue: T): RaxContext<T>;

  //
  // render
  // -----------------------------------
  type RenderOption<T> = { driver?: T | null }
  function render(element: ElementChildren, parent: Element | Document | DocumentFragment, options?: RenderOption<T>, callback?: () => void): void

}

export default Rax;
