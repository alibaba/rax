import { createElement, render } from 'rax';
import * as DriverDOM from 'driver-dom';

function Index(props) {
  return (
    <div>
      <h1>Page {props.data.title}</h1>
    </div>
  );
}

Index.getInitialProps = async function() {
  return { data: { title: 'Index' } };
};

export default Index;

// just for test
// webpack plugin entry part. not exist in develop env.
if (Index.getInitialProps) {
  Index.getInitialProps().then((props = {}) => {
    render(<Index {...props} />, document.body, { driver: DriverDOM });
  });
} else {
  render(<Index />, document.body, { driver: DriverDOM });
}

