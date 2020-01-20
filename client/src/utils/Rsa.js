import bigInt from 'big-integer';

class RSA {
    // this function will return a random prime number
    static randomPrime(bits) {
        const min = bigInt.one.shiftLeft(bits - 1);
        const max = bigInt.one.shiftLeft(bits).prev();

        while (true) {
            let p = bigInt.randBetween(min, max);
            if (p.isProbablePrime(256)) {
                return p;
            }
        }
    }

    // keysize is number of bits
    // this function will return an object with public key, public exponent and private key
    static generate(keysize) {
        const e = bigInt(65537);
        let p;
        let q;
        let totient;

        do {
            p = this.randomPrime(keysize / 2);
            q = this.randomPrime(keysize / 2);
            totient = bigInt.lcm(
                p.prev(),
                q.prev()
            );
        } while (bigInt.gcd(e, totient).notEquals(1) || p.minus(q).abs().shiftRight(keysize / 2 - 100).isZero());

        // e - public exponent, n - public key, private key
        return {
            pubExp: e,
            pubKey: p.multiply(q),
            priKey: e.modInv(totient),
        };
    }

    // this function will encrypt encoded message using public key and public exponent
    static encrypt(encodedMsg, pubKey, pubExp) {
        return bigInt(encodedMsg).modPow(pubExp, pubKey);
    }

    // this function will decrypt encrypted message using private key and public key
    static decrypt(encryptedMsg, priKey, pubKey) {
        return bigInt(encryptedMsg).modPow(priKey, pubKey);
    }

    // this function will encode the message (str)
    static encode(str) {
        const codes = str
            .split('')
            .map(i => i.charCodeAt())
            .join('');

        return bigInt(codes);
    }

    // this function will decode the message (code)
    static decode(code) {
        const stringified = code.toString();
        let string = '';

        for (let i = 0; i < stringified.length; i += 2) {
            let num = Number(stringified.substr(i, 2));

            if (num <= 30) {
                string += String.fromCharCode(Number(stringified.substr(i, 3)));
                i++;
            } else {
                string += String.fromCharCode(num);
            }
        }

        return string;
    }

    // this function will encode the message (str) and encrypt it
    static encryptMessage(str, pubKey, pubExp) {
        let encrypted = '';
        let len = str.length;
        for (let i = 0; i < len; i += 20) {
            let chunk = str.slice(i, i + 20);
            let encoded = this.encode(chunk);
            let enc = this.encrypt(encoded, pubKey, pubExp);
            encrypted += enc.toString() + '\n';
        }
        return encrypted;
    }

    // this function will decypt the message (str) and decode it
    static decryptMessage(str, priKey, pubKey) {
        let strChunks = str.split('\n');
        let msg = '';
        for (let i = 0; i < strChunks.length; ++i) {
            let chunk = strChunks[i];
            if (!chunk) continue;
            let decrypted = this.decrypt(chunk, priKey, pubKey);
            let decoded = this.decode(decrypted);
            msg += decoded;
        }
        return msg;
    }
}

export default RSA;