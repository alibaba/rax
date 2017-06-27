# Driver Spec `0.3`

Driver is the key concept that make the application cross-container running.
Rax have been implemented [browser driver](../../packages/driver-browser/src/index.js), [server driver](../../packages/driver-server/src/index.js) and [weex driver](../../packages/driver-weex/src/index.js).
If want Rax works on other container, only need implement the driver specification.
The driver should implement follow method:

* getElementById(id)
* createBody()
* createEmpty()
* createText(text)
* updateText(node, text)
* createElement(component: {type, props})
* appendChild(node, parent)
* removeChild(node, parent)
* replaceChild(newChild, oldChild, parent)
* insertAfter(node, after, parent)
* insertBefore(node, before, parent)
* addEventListener(node, eventName, eventHandler)
* removeEventListener(node, eventName, eventHandler)
* removeAllEventListeners(node)
* removeAttribute(node, propKey)
* setAttribute(node, propKey, propValue)
* setStyles(node, styles)
* getWindowWidth()
* beforeRender()
* afterRender()
* setNativeProps(node, props)
