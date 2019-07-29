declare type AnyObject = Record<string, any>

declare namespace Component {
  interface Methods {
    [propName: string]: any;
  }

  interface BaseProps<D extends AnyObject = any> {
    data?: D;
    props?: D;
    setData?<K extends keyof D>(
      data: D | Pick<D, K>,
      callback?: () => void,
    ): void;
  }

  interface Instance<
    D extends AnyObject = any,
    T extends AnyObject = any
  > extends BaseProps<D> {
    didMount?(): void;
    didUpdate?(prevProps: AnyObject, prevData: AnyObject): void;
    didUnmount?(): void;
    methods?: Methods;
    [propName: string]: any;
  }

  interface Constructor {
    <D extends AnyObject, T extends AnyObject & Instance>(
      options: Instance<D, T> & T,
    ): void;
  }
}

declare const Component: Component.Constructor;
