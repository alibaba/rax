# Universal Toast

Toast for Universal Rx.

## show

show(message, duration = SHORT_DELAY)

#### message : message in toast;
#### duration : custom duration，SHORT 2s， LONG 3.5s;

## example code

```js
import Toast from '@ali/rx-toast';
Toast.show('Hi'); // Default duration is SHORT
Toast.show('Hello', Toast.SHORT);
Toast.show('Hello', Toast.LONG);
```
