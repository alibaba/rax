import {createElement, render} from 'rax';
import * as DriverDOM from 'driver-dom';
import App from './pages/index/';

render(<App name="world" />, document.body, { driver: DriverDOM });