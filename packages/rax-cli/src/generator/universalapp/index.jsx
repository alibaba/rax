import { createElement, render } from 'rax';
import * as DriverUniversal from 'driver-universal';
import Home from './pages/home/index';

render(<Home />, document.body, { driver: DriverUniversal });
