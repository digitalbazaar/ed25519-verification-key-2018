/*!
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {Ed25519VerificationKey2018} = require('../../');
const mockKey = require('../mock-key.json');
const {stringToUint8Array} = require('../text-encoder');
const {util: {binary: {base58}}} = require('node-forge');

const keyPair = new Ed25519VerificationKey2018({
  publicKeyBase58: mockKey.publicKeyBase58,
  privateKeyBase58: mockKey.privateKeyBase58
});

const signer = keyPair.signer();
const verifier = keyPair.verifier();

// the same signature should be generated on every test platform
// (eg. browser, node12, node14)
const targetSignatureBase58 = '4AbhYFuwyJd3zPbqR6HieQPdz2DWK2k926v99AegFT9bMR' +
  'Koagq5be7edGQDhguu37qVw3ULE5fh4ZCTZEYNKxaM';

describe('sign and verify', () => {
  it('works properly', async () => {
    const data = stringToUint8Array('test 1234');
    const signature = await signer.sign({data});

    base58.encode(signature).should.equal(targetSignatureBase58);
    const result = await verifier.verify({data, signature});
    result.should.be.true;
  });
  it('fails if signing data is changed', async () => {
    const data = stringToUint8Array('test 1234');
    const signature = await signer.sign({data});
    const changedData = stringToUint8Array('test 4321');
    const result = await verifier.verify({data: changedData, signature});
    result.should.be.false;
  });
});
