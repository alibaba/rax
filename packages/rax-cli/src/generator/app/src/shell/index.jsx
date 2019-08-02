import { createElement } from 'rax';

function Shell(props) {
  console.log(props);
  return (
    <div>
      <div style={{ color: 'red' }}>header</div>
      {props.children}
      <div>footer</div>
    </div>
  );
}
export default Shell;