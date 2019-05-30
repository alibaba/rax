import { createElement, render } from 'rax';
import * as DriverWeex from 'driver-weex';
import * as DriverDom from 'driver-dom';
import { isWeex } from 'universal-env';
import MyComponent from '../src/index';

render(<MyComponent />, document.body, { driver: isWeex ? DriverWeex : DriverDom });
