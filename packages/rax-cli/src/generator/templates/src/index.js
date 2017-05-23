import {createElement, render} from 'rax';
import App from './App';

const hotRender = Component => render(<Component />);

hotRender(App);

// Enable hot reload
if (module.hot) {
  module.hot.accept(function(err) {
    if (err) {
      console.log(err);
    } else {
      hotRender(App);
    }
  });
}
