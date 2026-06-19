// Modern platforms have native DOMException globally available.
// This shim uses the native implementation cleanly and without registry deprecation warnings.
module.exports = globalThis.DOMException || Error;
