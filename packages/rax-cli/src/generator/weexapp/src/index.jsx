import {createElement, render} from 'rax';
import * as DriverWeex from 'driver-weex';
import App from './App';

render(<App name="world" />, DriverWeex.createBody(), { driver: DriverWeex });