// This is just a shim. I can't get the `exports-loader` to work because it tries to evaluate
// the commonjs stuff...

// let CURL = null

window.__curlConsoleOverride = {
    log: function(x) { CURL._onLog(x);}
}

const CURL = require('curl.lib.js')
console.log(CURL)
CURL.init()

// console.log(CURL);
// console.log(CURL.pow)

CURL.onStart = (cb) => {
    this._onStart = cb;
}

CURL.onPOW = (cb) => {
    this._onPOW = cb;
}

// CURL._onLog = (message) => {
//     console.log("MESSAGE:", message);

//     // if (CURL._onMessage) CURL._onMessage(message)
//     // if (message == 'starting!' && this._onStart) {
//     //     return this._onStart();
//     // }
//     // if (message.indexOf('got PoW!') == 0 && this._onPOW) {
//     //     message = message.replace('got PoW!', '').trim();
//     //     return this._onPOW(message);
//     // }
//     // console.log("[CURL]", message);
// }

CURL.onMessage = (cb) => {
    CURL._onMessage = cb
}

// CURL.onStart(() => {
//     console.log("Starting Proof-of-Work...");
// })

// CURL.onPOW((pow) => {
//     console.log("Received Proof-of-Work:");
//     console.log(pow);
// });

export default CURL;