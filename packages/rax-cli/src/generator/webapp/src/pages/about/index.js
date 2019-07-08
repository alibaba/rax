import { createElement } from 'rax';

export default (props) => {
  const { router } = props;
  return (
    <div>
      <h1>Hello Rax PWA</h1>
      <p>Modify the configuration of app.json, turn on the PWA features.</p>
      <button onClick={() => router.history.push('/index')}>Go home</button>
    </div>
  );
};
