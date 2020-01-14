# MiniApp History

## Usage
```js
import { createMiniAppHistory } from 'miniapp-history';

const history = createMiniAppHistory();
```

## API

### Support
* push({ url: soucePath })
* replace({ url: soucePath })
* goBack(delta)
* go(callback)
* canGo()

### UnSupport
* goForward()
