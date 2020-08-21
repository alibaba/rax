import { createElement, useState, useEffect, Fragment } from 'rax';
import { useRouter } from 'rax-use-router';
import { isWeb } from 'universal-env';
import { Navigation, TabBar } from 'rax-pwa';

const initialDataFromSSR = global.__INITIAL_DATA__;

function _isNullableComponent(component) {
  return !component || Array.isArray(component) && component.length === 0;
}

export default function App(props) {
  const { appConfig, history, routes, pageProps, InitialComponent } = props;
  const { component } = useRouter(() => ({ history, routes, InitialComponent }));

  if (_isNullableComponent(component)) {
    // Return null directly if not matched.
    return null;
  } else {
    const [pageInitialProps, setPageInitialProps] = useState(
      // If SSR is enabled, set pageInitialProps: {pagePath: pageData}
      initialDataFromSSR ? { [initialDataFromSSR.pagePath || '']: initialDataFromSSR.pageData || {} } : {}
    );

    // If SSR is enabled, process getInitialProps method
    if (isWeb && initialDataFromSSR && component.getInitialProps && !pageInitialProps[component.__path]) {
      useEffect(() => {
        const getInitialPropsPromise = component.getInitialProps();

        // Check getInitialProps returns promise.
        if (process.env.NODE_ENV !== 'production') {
          if (!getInitialPropsPromise.then) {
            throw new Error('getInitialProps should be async function or return a promise. See detail at "' + component.name + '".');
          }
        }

        getInitialPropsPromise.then((nextDefaultProps) => {
          if (nextDefaultProps) {
            // Process pageData from SSR
            const pageData = initialDataFromSSR && initialDataFromSSR.pagePath === component.__path ? initialDataFromSSR.pageData : {};
            // Do not cache getInitialPropsPromise result
            setPageInitialProps(Object.assign({}, { [component.__path]: Object.assign({}, pageData, nextDefaultProps) }));
          }
        }).catch((error) => {
          // In case of uncaught promise.
          throw error;
        });
      });
      // Early return null if initialProps were not get.
      return null;
    }

    if (isWeb) {
      return createElement(
        Navigation,
        Object.assign(
          { appConfig, component, history, location: history.location, routes, InitialComponent },
          pageInitialProps[component.__path],
          pageProps
        )
      );
    }

    return createElement(
      Fragment,
      {},
      createElement(component, Object.assign({ history, location: history.location, routes, InitialComponent }, pageInitialProps[component.__path], pageProps)),
      createElement(TabBar, { history, config: appConfig.tabBar })
    );
  }
}
