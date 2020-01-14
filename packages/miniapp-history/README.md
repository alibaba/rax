# MiniApp History

## Usage
```js
import { createMiniAppHistory } from 'miniapp-history';

const history = createMiniAppHistory();
```

## API

### Support
* push({ url: sourcePath })
* replace({ url: sourcePath })
* goBack(delta)
* go(callback)
* canGo()

### UnSupport
* goForward()
