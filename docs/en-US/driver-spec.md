# Driver Spec `1.0`

Driver is the key concept that make the application cross-container running.
Rax have been implemented [dom driver](../../packages/driver-dom/src/index.js), [server driver](../../packages/driver-server/src/index.js) and [weex driver](../../packages/driver-weex/src/index.js).
If want Rax works on other container, only need implement the driver specification.
The driver should implement follow method:

* createBody()
* createEmpty(component)
* createText(text, component)
* updateText(node, text)
* createElement(type, props, component)
* appendChild(node, parent)
* removeChild(node, parent)
* replaceChild(newChild, oldChild, parent)
* insertAfter(node, after, parent)
* insertBefore(node, before, parent)
* addEventListener(node, eventName, eventHandler)
* removeEventListener(node, eventName, eventHandler)
* setAttribute(node, propKey, propValue)
* removeAttribute(node, propKey)
* setStyle(node, styleObject)
* *beforeRender({element, hydrate, container})
* *afterRender({element, hydrate, container})
