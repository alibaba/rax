# jsx2mp-runtime

Provide runtime support for rax style miniapp.

- createComponent
   ```js
   const __class_def__ = class {
     state = {
       name: 'Rax'
     };
   
     handleTap() {
       this.setState({
         name: 'MiniApp'
       });
     }
   };
   
   const config = createComponent(__class_def__, 'class');

  Component(config);
  ```
- (state) useState(defaultValue, key)
  ```js
  const __fn_def__ = function Header(props) {
    const [name, setName] = useState('World', 'name');
    const [count, setCount] = useState(0, 'count');
  
    return {
      handleClick() {
        setName('Rax');
        setCount(count + 1);
      }
    }
  };
  
  const config = createComponent(__fn_def__, 'function');
  Component(config);
  ```
- (void) useEffect(callback)
  ```js
  const __fn_def__ = function Header(props) {
    const [name, setName] = useState('World', 'name');
    useEffect(() => {
      console.log('didMount');
  
      return function unmount() {
        console.log('unmount');
      };
    }, []);
  
    return {
      handleClick: () => {
        setName('Rax');
      },
    };
  };
  
  const config = createComponent(__fn_def__, 'function');
  Component(config);
  ```
