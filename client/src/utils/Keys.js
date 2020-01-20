import ChatHttpServer from '../services/ChatHttpServer';
import RSA from './Rsa';

async function getKeys() {
    let keys = await ChatHttpServer.getLSKeys();
    if (!keys.pubExp || !keys.pubKey || !keys.priKey) {
        let newKeys = RSA.generate(250);
        keys.pubExp = newKeys.pubExp.toString();
        keys.pubKey = newKeys.pubKey.toString();
        keys.priKey = newKeys.priKey.toString();
        await ChatHttpServer.setLSKeys(keys);
    }
    return keys;
}

function decrypt(data, priKey, pubKey) {
    let decrypted = RSA.decryptMessage(data, priKey, pubKey);
    return JSON.parse(decrypted);
}

export default { getKeys, decrypt };