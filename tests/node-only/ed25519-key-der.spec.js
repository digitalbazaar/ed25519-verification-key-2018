/*!
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
chai.should();

const {util: {binary: {base58}}} = require('node-forge');
const {base58Decode, privateKeyDerEncode, publicKeyDerEncode} =
  require('../../src/util');
const mockKey = require('../mock-key.json');

const targetPrivateDerBytesBase64 =
  'MC4CAQAwBQYDK2VwBCIEICuAHzsgGqFh8BWmT1iucnc0w4mS5KfnfnaOtHG6yWuA';
const targetPublicDerBytesBase64 =
  'MCowBQYDK2VwAyEAvHZI57pFMs4OnJfkcp0QSotH9LbDT/6yRtYKt/ZpUpU=';

const privateKeyBytes = base58Decode({
  decode: base58.decode,
  keyMaterial: mockKey.privateKeyBase58,
  type: 'private'
});

const publicKeyBytes = base58Decode({
  decode: base58.decode,
  keyMaterial: mockKey.publicKeyBase58,
  type: 'public'
});

describe('Ed25519 Keys', () => {
  describe('Ed25519 Private Key', () => {
    describe('DER encoding', () => {
      it('works properly', async () => {
        const forgeDer = privateKeyDerEncode({privateKeyBytes});
        const forgeDerBytesBase64 = Buffer.from(forgeDer).toString('base64');
        forgeDerBytesBase64.should.equal(targetPrivateDerBytesBase64);
      });
    }); // end DER encoding
  }); // end Ed25519 Private Key

  describe('Ed25519 Public Key', () => {
    describe('DER encoding', () => {
      it('works properly', async () => {
        const forgeDer = publicKeyDerEncode({publicKeyBytes});
        const forgeDerBytesBase64 = Buffer.from(forgeDer).toString('base64');
        forgeDerBytesBase64.should.equal(targetPublicDerBytesBase64);
      });
    }); // end DER encoding
  }); // end Ed25519 Private Key
});

