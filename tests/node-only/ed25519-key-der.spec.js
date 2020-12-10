/*!
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
chai.should();

const bs58 = require('base58-universal');
const {base58Decode} = require('../../src/');
const {_privateKeyDerEncode, _publicKeyDerEncode} =
  require('../../src/ed25519');

const mockKey = require('../mock-key.json');

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

