import { createElement, render } from 'rax';
import { createStore } from 'redux';
import { Provider } from 'rax-redux';
import App from './components/App';
import rootReducer from './reducers';

const store = createStore(rootReducer);

render(
  <Provider store={store}>
    <App />
  </Provider>
);
