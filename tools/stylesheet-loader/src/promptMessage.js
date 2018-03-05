let warnMessages = '';
let errorMessages = '';

export const getWarnMessages = () => {
  return warnMessages;
};

export const getErrorMessages = () => {
  return errorMessages;
};

export const pushWarnMessage = (message) => {
  message = message.replace(/`/g, '\\`');
  warnMessages += `${message}\\n`;
};

export const pushErrorMessage = (message) => {
  message = message.replace(/`/g, '\\`');
  errorMessages += `${message}\\n`;
};

export const resetMessage = () => {
  warnMessages = '';
  errorMessages = '';
};
