/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import {
  sign,
  verify,
  createPrivateKey,
  createPublicKey,
  randomBytes
} from 'crypto';
import {promisify} from 'util';
import {
  DER_PUBLIC_KEY_PREFIX,
  DER_PRIVATE_KEY_PREFIX,
  privateKeyDerEncode,
  publicKeyDerEncode
} from './util.js';

const randomBytesAsync = promisify(randomBytes);

// used to export node's public keys to buffers
const publicKeyEncoding = {format: 'der', type: 'spki'};

const api = {
  /**
   * Generates a key using a 32 byte Uint8Array.
   *
   * @param {Uint8Array} seedBytes - The bytes for the private key.
   *
   * @returns {object} The object with the public and private key material.
  */
  async generateKeyPairFromSeed(seedBytes) {
    const privateKey = await createPrivateKey({
      // node is more than happy to create a new private key using a DER
      key: privateKeyDerEncode({seedBytes}),
      format: 'der',
      type: 'pkcs8'
    });
    // this expects either a PEM encoded key or a node privateKeyObject
    const publicKey = await createPublicKey(privateKey);
    const publicKeyBuffer = publicKey.export(publicKeyEncoding);
    const publicKeyBytes = getKeyMaterial(publicKeyBuffer);
    return {
      publicKey: publicKeyBytes,
      secretKey: Buffer.concat([seedBytes, publicKeyBytes])
    };
  },
  // generates an ed25519 key using a random seed
  async generateKeyPair() {
    const seed = await randomBytesAsync(32);
    return api.generateKeyPairFromSeed(seed);
  },
  async sign(privateKeyBytes, data) {
    const privateKey = await createPrivateKey({
      key: privateKeyDerEncode({privateKeyBytes}),
      format: 'der',
      type: 'pkcs8'
    });
    return sign(null, data, privateKey);
  },
  async verify(publicKeyBytes, data, signature) {
    const publicKey = await createPublicKey({
      key: publicKeyDerEncode({publicKeyBytes}),
      format: 'der',
      type: 'spki'
    });
    return verify(null, data, publicKey, signature);
  }
};

export default api;

/**
 * The key material is the part of the buffer after the DER Prefix.
 *
 * @param {Buffer} buffer - A DER encoded key buffer.
 *
 * @throws {Error} If the buffer does not contain a valid DER Prefix.
 *
 * @returns {Buffer} The key material part of the Buffer.
*/
function getKeyMaterial(buffer) {
  if(buffer.indexOf(DER_PUBLIC_KEY_PREFIX) === 0) {
    return buffer.slice(DER_PUBLIC_KEY_PREFIX.length, buffer.length);
  }
  if(buffer.indexOf(DER_PRIVATE_KEY_PREFIX) === 0) {
    return buffer.slice(DER_PRIVATE_KEY_PREFIX.length, buffer.length);
  }
  throw new Error('Expected Buffer to match Ed25519 Public or Private Prefix');
}
