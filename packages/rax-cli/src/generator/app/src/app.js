import { createElement } from 'rax';
import { useAppEffect} from '@core/app';
import { useRouter } from '@core/router';

export default function App(props) {
  const { routerConfig } = props;
  useAppEffect('launch', (options) => {

  });
  const { Router, history } = useRouter(routerConfig); // 统一接口的 useRouter

  return <Router {...props} />;
}