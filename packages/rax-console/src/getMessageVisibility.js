import {
  DEFAULT_FILTERS,
  DEFAULT_FILTERS_VALUES,
  FILTERS,
  MESSAGE_TYPE,
  MESSAGE_SOURCE,
} from './const';

/**
 * Check if a message should be visible in the console output, and if not, what
 * causes it to be hidden.
 *
 * @return {Object} An object of the following form:
 *         - visible {Boolean}: true if the message should be visible
 *         - cause {String}: if visible is false, what causes the message to be hidden.
 */
export default function getMessageVisibility(message, messagesState, filtersState, checkGroup = true) {
  if (!passSearchFilters(message, filtersState)) {
    return {
      visible: false,
      cause: FILTERS.TEXT
    };
  }

  // Let's check all level filters (error, warn, log, …) and return visible: false
  // and the message level as a cause if the function returns false.
  if (!passLevelFilters(message, filtersState)) {
    return {
      visible: false,
      cause: message.level
    };
  }

  return {
    visible: true
  };
}


/**
 * Returns true if the message shouldn't be hidden because of levels filter state.
 *
 * @param {Object} message - The message to check the filter against.
 * @param {FilterState} filters - redux "filters" state.
 * @returns {Boolean}
 */
function passLevelFilters(message, filters) {
  // The message passes the filter if it is not a console call,
  // or if its level matches the state of the corresponding filter.
  return (
    message.source !== MESSAGE_SOURCE.CONSOLE_API &&
    message.source !== MESSAGE_SOURCE.JAVASCRIPT ||
    filters[message.level] === true
  );
}

/**
 * Returns true if the message shouldn't be hidden because of search filter state.
 *
 * @param {Object} message - The message to check the filter against.
 * @param {FilterState} filters - redux "filters" state.
 * @returns {Boolean}
 */
function passSearchFilters(message, filters) {
  let text = (filters.text || '').trim();

  // If there is no search, the message passes the filter.
  if (!text) {
    return true;
  }

  return (
    // Look for a match in parameters.
    isTextInParameters(text, message.parameters)
    // Look for a match in location.
    || isTextInFrame(text, message.frame)
    // Look for a match in net events.
    || isTextInNetEvent(text, message.request)
    // Look for a match in stack-trace.
    || isTextInStackTrace(text, message.stacktrace)
    // Look for a match in messageText.
    || isTextInMessageText(text, message.messageText)
    // Look for a match in notes.
    || isTextInNotes(text, message.notes)
    // Look for a match in prefix.
    || isTextInPrefix(text, message.prefix)
  );
}

/**
* Returns true if given text is included in provided stack frame.
*/
function isTextInFrame(text, frame) {
  if (!frame) {
    return false;
  }

  const {
    functionName,
    line,
    column,
    source
  } = frame;
  const { short } = getSourceNames(source);
  const unicodeShort = getUnicodeUrlPath(short);

  const includes =
    `${functionName ? functionName + ' ' : ''}${unicodeShort}:${line}:${column}`
      .toLocaleLowerCase()
      .includes(text.toLocaleLowerCase());
  return includes;
}

/**
* Returns true if given text is included in provided parameters.
*/
function isTextInParameters(text, parameters) {
  if (!parameters) {
    return false;
  }

  text = text.toLocaleLowerCase();
  return getAllProps(parameters).some(prop =>
    (prop + '').toLocaleLowerCase().includes(text)
  );
}

/**
* Returns true if given text is included in provided net event grip.
*/
function isTextInNetEvent(text, request) {
  if (!request) {
    return false;
  }

  text = text.toLocaleLowerCase();

  let method = request.method.toLocaleLowerCase();
  let url = request.url.toLocaleLowerCase();
  return method.includes(text) || url.includes(text);
}

/**
* Returns true if given text is included in provided stack trace.
*/
function isTextInStackTrace(text, stacktrace) {
  if (!Array.isArray(stacktrace)) {
    return false;
  }

  // isTextInFrame expect the properties of the frame object to be in the same
  // order they are rendered in the Frame component.
  return stacktrace.some(frame => isTextInFrame(text, {
    functionName: frame.functionName || l10n.getStr('stacktrace.anonymousFunction'),
    source: frame.filename,
    lineNumber: frame.lineNumber,
    columnNumber: frame.columnNumber
  }));
}

/**
* Returns true if given text is included in `messageText` field.
*/
function isTextInMessageText(text, messageText) {
  if (!messageText) {
    return false;
  }

  return messageText.toLocaleLowerCase().includes(text.toLocaleLowerCase());
}

/**
* Returns true if given text is included in notes.
*/
function isTextInNotes(text, notes) {
  if (!Array.isArray(notes)) {
    return false;
  }

  return notes.some(note =>
    // Look for a match in location.
    isTextInFrame(text, note.frame) ||
    // Look for a match in messageBody.

      note.messageBody &&
      note.messageBody.toLocaleLowerCase().includes(text.toLocaleLowerCase())

  );
}

/**
* Returns true if given text is included in prefix.
*/
function isTextInPrefix(text, prefix) {
  if (!prefix) {
    return false;
  }

  return `${prefix}: `.toLocaleLowerCase().includes(text.toLocaleLowerCase());
}

