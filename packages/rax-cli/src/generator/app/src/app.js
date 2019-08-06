import { createElement } from 'rax';
import { useRouter } from '@core/router';

export default function App(props) {
  const { routerConfig } = props;

  const { Router } = useRouter(routerConfig);

  return <Router {...props} />;
}
