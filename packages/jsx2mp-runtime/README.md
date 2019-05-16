# jsx2mp-runtime

provide runtime support for react code in applet environments

# runtime-type

- component runtime
  ``` 
  function index() {
      return <View></View>
  }

  to

  Component({})
  ```
- page runtime
   ``` 
  class Index extends Component() {
      return <View></View>
  }

  to

  Page({})
  ```
- api
  ```
  hooks
  ...
  ```
