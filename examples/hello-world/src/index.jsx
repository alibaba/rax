import {createElement, render} from 'rax';
import DomDriver from 'driver-dom';
import Hello from './Hello';

render(<Hello name="world" />, document.body, { driver: DomDriver });
