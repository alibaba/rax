import { createElement } from 'rax';
import { useAppEffect} from '@core/app';
import { useRouter } from '@core/router';

export default function App(props) {
  const { routerConfig } = props;
  useAppEffect('launch', (options) => {

  });

  const { Router } = useRouter(routerConfig);

  return <Router {...props} />;
}
