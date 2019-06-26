import { createElement, render } from 'rax';
import DriverUniversal from 'driver-universal';

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


render(<DemoList demos={window.demos} />, null, { driver: DriverUniversal });

