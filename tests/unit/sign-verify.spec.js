/*!
 * Copyright (c) 2018-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {Ed25519VerificationKey2018} from '../../lib/index.js';
import {mockKey} from '../mock-data.js';
import {stringToUint8Array} from '../text-encoder.js';
import * as bs58 from 'base58-universal';

const keyPair = new Ed25519VerificationKey2018({
  controller: 'did:ex:1234',
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
    signer.should.have.property('id',
      'did:ex:1234#z6Mks8wJbzhWdmkQZgw7z2qHwaxPVnFsFmEZSXzGkLkvhMvL');
    verifier.should.have.property('id',
      'did:ex:1234#z6Mks8wJbzhWdmkQZgw7z2qHwaxPVnFsFmEZSXzGkLkvhMvL');
    const data = stringToUint8Array('test 1234');
    const signature = await signer.sign({data});
    bs58.encode(signature).should.equal(targetSignatureBase58);
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
