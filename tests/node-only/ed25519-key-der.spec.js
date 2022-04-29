/*!
 * Copyright (c) 2018-2022 Digital Bazaar, Inc. All rights reserved.
 */
import chai from 'chai';
chai.should();

import * as bs58 from 'base58-universal';
import {base58Decode} from '../../lib/index.js';
import {mockKey} from '../mock-key.js';
import {
  _privateKeyDerEncode, _publicKeyDerEncode
} from '../../lib/ed25519.js';

const targetPrivateDerBytesBase64 =
  'MC4CAQAwBQYDK2VwBCIEICuAHzsgGqFh8BWmT1iucnc0w4mS5KfnfnaOtHG6yWuA';
const targetPublicDerBytesBase64 =
  'MCowBQYDK2VwAyEAvHZI57pFMs4OnJfkcp0QSotH9LbDT/6yRtYKt/ZpUpU=';

const privateKeyBytes = base58Decode({
  decode: bs58.decode,
  keyMaterial: mockKey.privateKeyBase58,
  type: 'private'
});

const publicKeyBytes = base58Decode({
  decode: bs58.decode,
  keyMaterial: mockKey.publicKeyBase58,
  type: 'public'
});

describe('Ed25519 Keys', () => {
  describe('Ed25519 Private Key', () => {
    describe('DER encoding', () => {
      it('works properly', async () => {
        const privateDer = _privateKeyDerEncode({privateKeyBytes});
        const privateDerBytesBase64 = Buffer.from(privateDer).toString(
          'base64');
        privateDerBytesBase64.should.equal(targetPrivateDerBytesBase64);
      });
    }); // end DER encoding
  }); // end Ed25519 Private Key

  describe('Ed25519 Public Key', () => {
    describe('DER encoding', () => {
      it('works properly', async () => {
        const publicDer = _publicKeyDerEncode({publicKeyBytes});
        const publicDerBytesBase64 = Buffer.from(publicDer).toString('base64');
        publicDerBytesBase64.should.equal(targetPublicDerBytesBase64);
      });
    }); // end DER encoding
  }); // end Ed25519 Private Key
});

