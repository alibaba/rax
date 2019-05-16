import {createElement, render} from 'rax';
import * as DriverWeex from 'driver-weex';
import * as DriverDOM from 'driver-dom';
import { isWeex } from 'universal-env';
import App from './App';

render(
  <App />,
  isWeex ? DriverWeex.createBody() : document.body,
  { driver: isWeex ? DriverWeex : DriverDOM }
);
