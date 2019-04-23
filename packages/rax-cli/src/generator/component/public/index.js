import {createElement, render} from 'rax';
import * as DriverDOM from 'driver-dom';
import App from '../src/index';

render(<App />, document.body, { driver: DriverDOM });
