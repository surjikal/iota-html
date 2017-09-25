
import * as _ from 'lodash';
import CURL from '../vendor/curl';
import IOTA from '../vendor/iota';

const MAX_TRYTES = 2187;

const DEFAULT_CONFIG = {
    depth: 9
,   minWeightMagnitude: 15
}

// let CURL = require('curl.lib.js')
// // let IOTA = require('iota.lib.js')
// let seed = "ANKOCZLLU9IDVH9CNMWRPCGYKTHVAXYXZXIISPKIATVKHVJHZFWUJWZAPUTPGGGXWXVOBJKCBCGXQNIXC"
// let iota = new IOTA({host:"http://localhost", port:14500})
// CURL.overrideAttachToTangle(iota.api);
// CURL.init()
// iota.api.getNewAddress(seed, {checksum:false}, (error, address) => {
//     console.log("GOT ADDRESS!")
//     console.log(address)
//     if (error) throw error;
//     let transfers = [{
//         'address': address,
//         'message': iota.utils.toTrytes("testing"),
//         'value': 0,
//         'tag': 'SURJIKAL'
//     }]
//     iota.api.sendTransfer(seed, 4, 14, transfers, (error, results) => {
//         if (error) throw error;
//         console.log("RESULTS:")
//         console.log(results)
//     });
// });


export default class IOTAClient {

    constructor(config) {
        console.log("CONFIG:", config);
        this.config = _.extend({}, DEFAULT_CONFIG, config);
        this.config.seed = this.config.seed || this._generateSeed();
        console.log("SEED:", this.config.seed);
        this.iota = new IOTA(config);
        // CURL.overrideAttachToTangle(this.iota.api);
    }

    getMessage(bundle) {
        return new Promise((resolve, reject) => {
            this.iota.api.findTransactionObjects({bundles:[bundle]}, (error, response) => {
                if (error) return reject(error);
                response = _.sortBy(response, ((x) => { return x.currentIndex; }));
                let chunks = response.map((x) => {
                    let fragment = x.signatureMessageFragment;
                    return fragment.replace(/9*$/, "");
                });
                let data = this.iota.utils.fromTrytes(chunks.join(''));
                data = this._deserialize(data)
                resolve(data);
            });
        });
    }

    sendMessage(message, handlers) {
        if (!_.isString(message)) throw new Error("Argument `message` must be a string.")
        if (!handlers) handlers = {}
        console.log(handlers)
        message = this._serialize(message)
        console.log("Sending message:", message);
        return this._generateAddress(this.config.seed).then((address) => {
            console.log("Generated address:", address);
            let transfers = this._generateTransfers(address, message);
            console.log("Generated transfers:\n", JSON.stringify(transfers, null, 2))
            // return this._prepareTransfers(this.config.seed, transfers)
            return this._sendTransfers(this.config.seed, transfers);
        })
        .catch((error) => {
            console.error("Error occured while sending transaction...")
            throw error
        })
        .then((bundle) => {
            console.log("Received bundle:", bundle);
            return bundle;
        });
    }

    _generateSeed() {
        let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9".split('');
        return _.sampleSize(alphabet, 80).join('');
    }

    _generateAddress(seed, options) {
        return new Promise((resolve, reject) => {
            if (!options) options = {'checksum': false}
            this.iota.api.getNewAddress(seed, options, (error, address) => {
                return error ? reject(error) : resolve(address);
            });
        });
    }

    _prepareTransfers(seed, transfers) {
        return new Promise((resolve, reject) => {
            this.iota.api.prepareTransfers(seed, transfers, (error, response) => {
                console.log("ERROR:", error);
                console.log("RESPONSE:", response);
                response.forEach((x) => console.log(x.length))
                return error? reject(error) : resolve(error)
            });
        });
    }

    _sendTransfers(seed, transfers, options) {
        return new Promise((resolve, reject) => {
            const {depth, minWeightMagnitude} = _.extend({}, options, this.config)
            this.iota.api.sendTransfer(seed, depth, minWeightMagnitude, transfers, (error, results) => {
                error ? reject(error)
                      : resolve(results[0].bundle);
            });
        });
    }

    _generateTransfers(address, data) {
        if (!_.isString(data)) throw new Error("Argument `data` must be a string.");
        const trytes = this.iota.utils.toTrytes(data);
        if (trytes === null) throw new Error("Could not convert data to trytes...");
        const chunks = _.chunk(trytes, MAX_TRYTES).map((x) => { return x.join(''); })
        return chunks.map((chunk) => this._generateTransfer(address, chunk) )
    }

    _generateTransfer(address, data) {
        return {
            'address': address,
            'message': data,
            'value': 0,
            'tag': 'DUMMY'
        };
    }

    _serialize(message) {
        message = btoa(message)
        return message
    }

    _deserialize(data) {
        return atob(data)
    }
}

