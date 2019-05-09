import { createElement } from 'rax';
import Header from '../components/header';
import './index.css';


export default function Layout(props) {
  return (
    <div>
      <Header />
      {props.children}
    </div>
  );
}