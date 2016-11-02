export default {
  OS: navigator.platform.toLowerCase(),
  select: obj => obj[OS],
}
