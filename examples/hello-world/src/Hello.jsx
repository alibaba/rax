import {createElement, useState} from 'rax';

export default (props) => {
  const [name, setName] = useState(props.name);
  const handleClick = () => {
    setName('rax');
  };
  return (
    <div style={styles.hello}>
      <span style={styles.title} onClick={handleClick}>
      Hello {name}
      </span>
    </div>
  );
};

const styles = {
  hello: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: '40px',
    textAlign: 'center'
  }
};