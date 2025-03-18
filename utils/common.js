const util = require("util");

/**
 * Converts a base64 string to a hexadecimal string
 * @param {string} base64 - Base64 encoded string
 * @returns {string} - Hexadecimal representation of the data
 */
function base64ToHex(base64) {
  const arrayBuffer = base64ToArrayBuffer(base64);
  const buffer = Buffer.from(arrayBuffer);
  return Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength).toString("hex");
}

/**
 * Converts a base64 string to an ArrayBuffer
 * @param {string} base64 - Base64 encoded string
 * @returns {ArrayBuffer} - Decoded data as ArrayBuffer
 */
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Sets up debug logging based on environment variable
 * @param {boolean} debugMode - Whether debug mode is enabled
 */
function setupDebugLogging(debugMode = false) {
  /**
   * Custom debug function that only logs when debug mode is enabled
   * @param {...any} args - Arguments to log when in debug mode
   */
  console.debug = (...args) => {
    if (debugMode) {
      console.log(...args);
    }
  };

  /**
   * Extended console.log that deeply inspects objects with colors
   * @param {...any} args - Arguments to inspect and log
   */
  console.deepLog = (...args) => args.forEach((obj) => console.log(util.inspect(obj, false, null, true)));
}

module.exports = {
  base64ToHex,
  base64ToArrayBuffer,
  setupDebugLogging,
};
