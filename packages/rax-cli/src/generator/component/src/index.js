import { createElement } from 'rax';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerBody: {
    fontSize: 40,
    color: '#999'
  }
};

export default (props) => {
  return (
    <div style={styles.container}>
      <div style={styles.containerBody}>hello world</div>
    </div>
  );
};
