# Driver Spec

Driver is the key concept that make the application cross-container running.
Rax have been implemented [browser driver](../packages/rax/src/drivers/browser.js), [server driver](../packages/rax/src/drivers/server.js) and [weex driver](../packages/rax/src/drivers/weex.js).
If want Rax works on other container, only need implement the driver specification.
The Driver should implement follow method:

* getElementById(id)
* getChildNodes(node)
* createBody()
* createFragment()
* createComment(content)
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
