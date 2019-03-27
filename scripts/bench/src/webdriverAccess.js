const { By, Condition } = require('selenium-webdriver');
const config = require('./config');

let useShadowRoot = false;
function setUseShadowRoot(val) {
  useShadowRoot = val;
}

// Fake findByXPath for simple XPath expressions to allow usage with shadow dom
async function findByXPath(node, path) {
  const elems = await node.findElements(By.xpath(path));
  if (elems.length) {
    return elems[0];
  }
  return null;
}

function waitForCondition(driver) {
  return async function(text, fn, timeout) {
    return await driver.wait(new Condition(text, fn), timeout);
  };
}

// driver.findElement(By.xpath("//tbody/tr[1]/td[1]")).getText().then(...) can throw a stale element error:
// thus we're using a safer way here:
async function testTextContains(driver, xpath, text, timeout = config.TIMEOUT) {
  return waitForCondition(driver)(
    `testTextContains ${xpath} ${text}`,
    async function(driver) {
      try {
        let elem = await shadowRoot(driver);
        elem = await findByXPath(elem, xpath);
        if (elem == null) return false;
        let v = await elem.getText();
        return v && v.indexOf(text) > -1;
      } catch (err) {
        console.log(
          'ignoring error in testTextContains for xpath = ' +
            xpath +
            ' text = ' +
            text,
          err.toString().split('\n')[0]
        );
      }
    },
    timeout
  );
}

function testTextNotContained(driver, xpath, text, timeout = config.TIMEOUT) {
  return waitForCondition(driver)(
    `testTextNotContained ${xpath} ${text}`,
    async function(driver) {
      try {
        let elem = await shadowRoot(driver);
        elem = await findByXPath(elem, xpath);
        if (elem == null) return false;
        let v = await elem.getText();
        return v && v.indexOf(text) == -1;
      } catch (err) {
        console.log(
          'ignoring error in testTextNotContained for xpath = ' +
            xpath +
            ' text = ' +
            text,
          err.toString().split('\n')[0]
        );
      }
    },
    timeout
  );
}

function testClassContains(driver, xpath, text, timeout = config.TIMEOUT) {
  return waitForCondition(driver)(
    `testClassContains ${xpath} ${text}`,
    async function(driver) {
      try {
        let elem = await shadowRoot(driver);
        elem = await findByXPath(elem, xpath);
        if (elem == null) return false;
        let v = await elem.getAttribute('class');
        return v && v.indexOf(text) > -1;
      } catch (err) {
        console.log(
          'ignoring error in testClassContains for xpath = ' +
            xpath +
            ' text = ' +
            text,
          err.toString().split('\n')[0]
        );
      }
    },
    timeout
  );
}

function testElementLocatedByXpath(driver, xpath, timeout = config.TIMEOUT) {
  return waitForCondition(driver)(
    `testElementLocatedByXpath ${xpath}`,
    async function(driver) {
      try {
        let elem = await shadowRoot(driver);
        elem = await findByXPath(elem, xpath);
        return elem ? true : false;
      } catch (err) {
        console.log(
          'ignoring error in testElementLocatedByXpath for xpath = ' + xpath,
          err.toString()
        );
      }
    },
    timeout
  );
}

function testElementNotLocatedByXPath(driver, xpath, timeout = config.TIMEOUT) {
  return waitForCondition(driver)(
    `testElementNotLocatedByXPath ${xpath}`,
    async function(driver) {
      try {
        let elem = await shadowRoot(driver);
        elem = await findByXPath(elem, xpath);
        return elem ? false : true;
      } catch (err) {
        console.log(
          'ignoring error in testElementNotLocatedByXPath for xpath = ' + xpath,
          err.toString().split('\n')[0]
        );
      }
    },
    timeout
  );
}

function testElementLocatedById(driver, id, timeout = config.TIMEOUT) {
  return waitForCondition(driver)(
    `testElementLocatedById ${id}`,
    async function(driver) {
      try {
        let elem = await shadowRoot(driver);
        elem = await elem.findElement(By.id(id));
        return true;
      } catch (err) {
        // console.log("ignoring error in testElementLocatedById for id = "+id,err.toString().split("\n")[0]);
      }
    },
    timeout
  );
}

async function retry(retryCount, driver, fun) {
  for (let i = 0; i < retryCount; i++) {
    try {
      return fun(driver, i);
    } catch (err) {
      console.log('retry failed');
    }
  }
}
// Stale element prevention. For aurelia even after a testElementLocatedById clickElementById for the same id can fail
// No idea how that can be explained
function clickElementById(driver, id) {
  return retry(5, driver, async function(driver) {
    let elem = await shadowRoot(driver);
    elem = await elem.findElement(By.id(id));
    await elem.click();
  });
}

function clickElementByXPath(driver, xpath) {
  return retry(5, driver, async function(driver, count) {
    if (count > 1 && config.LOG_DETAILS)
      console.log('clickElementByXPath ', xpath, ' attempt #', count);
    let elem = await shadowRoot(driver);
    elem = await findByXPath(elem, xpath);
    await elem.click();
  });
  // Stale element possible:
  // return to(driver.findElement(By.xpath(xpath)).click());
}

async function getTextByXPath(driver, xpath) {
  return await retry(5, driver, async function(driver, count) {
    if (count > 1 && config.LOG_DETAILS)
      console.log('getTextByXPath ', xpath, ' attempt #', count);
    let elem = await shadowRoot(driver);
    elem = await findByXPath(elem, xpath);
    return await elem.getText();
  });
}

async function shadowRoot(driver) {
  return useShadowRoot
    ? await driver.executeScript(
      'return document.querySelector("main-element").shadowRoot'
    )
    : await driver.findElement(By.tagName('body'));
}

module.exports = {
  setUseShadowRoot,
  testTextContains,
  testTextNotContained,
  testClassContains,
  testElementLocatedByXpath,
  testElementNotLocatedByXPath,
  testElementLocatedById,
  clickElementById,
  clickElementByXPath,
  getTextByXPath
};
