import { createElement, render } from 'rax';
import * as DriverWeex from 'driver-weex';
import * as DriverDom from 'driver-dom';
import { isWeex } from 'universal-env';

const DemoList = ({ demos = [] }) => {
  return (
    <div>
      <h1 style={{
        fontSize: '24px'
      }}>Demos</h1>
      {
        demos.map(({name, title}) => (
          <a style={{display: 'block'}} href={`demo/${name}.html`}>{name} {title}</a>
        ))
      }
    </div>
  );
};


render(<DemoList demos={window.demos} />, document.body, { driver: isWeex ? DriverWeex : DriverDom });

