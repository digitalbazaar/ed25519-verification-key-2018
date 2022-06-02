/*!
 * Copyright (c) 2018-2022 Digital Bazaar, Inc. All rights reserved.
 */
import chai from 'chai';
import * as bs58 from 'base58-universal';
import {mockKey} from '../mock-key.js';
import multibase from 'multibase';
import multicodec from 'multicodec';
const should = chai.should();

const {expect} = chai;

import {Ed25519VerificationKey2018} from '../../lib/index.js';

describe('Ed25519VerificationKey2018', () => {
  describe('class', () => {
    it('should have suite and SUITE_CONTEXT properties', async () => {
      expect(Ed25519VerificationKey2018).to.have.property('suite',
        'Ed25519VerificationKey2018');
      expect(Ed25519VerificationKey2018).to.have.property('SUITE_CONTEXT',
        'https://w3id.org/security/suites/ed25519-2018/v1');
    });
  });

  describe('constructor', () => {
    it('should auto-set key.id based on controller, if present', async () => {
      const {publicKeyBase58} = mockKey;
      const controller = 'did:example:1234';

      const keyPair = new Ed25519VerificationKey2018(
        {controller, publicKeyBase58});
      expect(keyPair.id).to.equal(
        'did:example:1234#z6Mks8wJbzhWdmkQZgw7z2qHwaxPVnFsFmEZSXzGkLkvhMvL');
    });

    it('should error if publicKeyBase58 property is missing', async () => {
      let error;
      try {
        new Ed25519VerificationKey2018();
      } catch(e) {
        error = e;
      }
      expect(error).to.be.an.instanceof(TypeError);
      expect(error.message)
        .to.equal('The "publicKeyBase58" property is required.');
    });
  });

  describe('export', () => {
    it('should export id, type and key material', async () => {
      const keyPair = await Ed25519VerificationKey2018.generate();
      keyPair.id = 'did:ex:123#test-id';
      const pastDate = new Date(2020, 11, 17).toISOString()
        .replace(/\.[0-9]{3}/, '');
      keyPair.revoked = pastDate;
      const exported = await keyPair.export({
        publicKey: true, privateKey: true
      });

      expect(exported).to.have.keys(
        ['id', 'type', 'publicKeyBase58', 'privateKeyBase58', 'revoked']
      );
      expect(exported).to.have.property('id', 'did:ex:123#test-id');
      expect(exported).to.have.property('type', 'Ed25519VerificationKey2018');
      expect(exported).to.have.property('revoked', pastDate);
    });

    it('should only export public key if specified', async () => {
      const keyPair = await Ed25519VerificationKey2018.generate({
        id: 'did:ex:123#test-id'
      });
      const exported = await keyPair.export({publicKey: true});

      expect(exported).to.have.keys(['id', 'type', 'publicKeyBase58']);
      expect(exported).to.have.property('id', 'did:ex:123#test-id');
      expect(exported).to.have.property('type', 'Ed25519VerificationKey2018');
    });
  });

  describe('generate', () => {
    it('should generate a key pair', async () => {
      let ldKeyPair;
      let error;
      try {
        ldKeyPair = await Ed25519VerificationKey2018.generate();
      } catch(e) {
        error = e;
      }
      should.not.exist(error);
      should.exist(ldKeyPair.privateKeyBase58);
      should.exist(ldKeyPair.publicKeyBase58);
      const privateKeyBytes = bs58.decode(ldKeyPair.privateKeyBase58);
      const publicKeyBytes = bs58.decode(ldKeyPair.publicKeyBase58);
      privateKeyBytes.length.should.equal(64);
      publicKeyBytes.length.should.equal(32);
    });
    it('should generate the same key from the same seed', async () => {
      const seed = new Uint8Array(32);
      seed.fill(0x01);
      const keyPair1 = await Ed25519VerificationKey2018.generate({seed});
      const keyPair2 = await Ed25519VerificationKey2018.generate({seed});
      expect(keyPair1.publicKeyBase58).to.equal(keyPair2.publicKeyBase58);
      expect(keyPair1.privateKeyBase58).to.equal(keyPair2.privateKeyBase58);
    });
    it('should fail to generate a key with an invalid seed', async () => {
      let error;
      let keyPair;
      try {
        const seed = 'invalid-type';
        keyPair = await Ed25519VerificationKey2018.generate({seed});
      } catch(e) {
        error = e;
      }
      expect(error).to.exist;
      expect(keyPair).not.to.exist;
    });
  });

  describe('signer factory', () => {
    it('should create a signer', async () => {
      const ldKeyPair = await Ed25519VerificationKey2018.generate();
      const signer = ldKeyPair.signer();
      should.exist(signer.sign);
      signer.sign.should.be.a('function');
    });
  }); // end signer factor

  describe('fingerprint', () => {
    it('should create an Ed25519 key fingerprint', async () => {
      const keyPair = await Ed25519VerificationKey2018.generate();
      const fingerprint = keyPair.fingerprint();
      fingerprint.should.be.a('string');
      fingerprint.startsWith('z').should.be.true;
    });
    it('should be properly multicodec encoded', async () => {
      const keyPair = await Ed25519VerificationKey2018.generate();
      const fingerprint = keyPair.fingerprint();
      const mcPubkeyBytes = multibase.decode(fingerprint);
      const mcType = multicodec.getCodec(mcPubkeyBytes);
      mcType.should.equal('ed25519-pub');
      const pubkeyBytes = multicodec.rmPrefix(mcPubkeyBytes);
      const encodedPubkey = bs58.encode(pubkeyBytes);
      encodedPubkey.should.equal(keyPair.publicKeyBase58);
      expect(typeof keyPair.fingerprint()).to.equal('string');
    });
    it('throws TypeError on improper public key material', async () => {
      const keyPair = await Ed25519VerificationKey2018.generate();
      let error;
      let result;
      keyPair.publicKeyBase58 = 'PUBLICKEYINFO';
      try {
        result = keyPair.fingerprint();
      } catch(e) {
        error = e;
      }
      should.not.exist(result);
      should.exist(error);
      error.should.be.instanceof(TypeError);
      error.message.should.contain('must be Base58 encoded');
    });
  });

  describe('verify fingerprint', () => {
    it('should verify a valid fingerprint', async () => {
      const keyPair = await Ed25519VerificationKey2018.generate();
      const fingerprint = keyPair.fingerprint();
      const result = keyPair.verifyFingerprint({fingerprint});
      expect(result).to.exist;
      result.should.be.an('object');
      expect(result.valid).to.exist;
      result.valid.should.be.a('boolean');
      result.valid.should.be.true;
    });
    it('should reject an improperly encoded fingerprint', async () => {
      const keyPair = await Ed25519VerificationKey2018.generate();
      const fingerprint = keyPair.fingerprint();
      const result = keyPair.verifyFingerprint(
        {fingerprint: fingerprint.slice(1)});
      expect(result).to.exist;
      result.should.be.an('object');
      expect(result.valid).to.exist;
      result.valid.should.be.a('boolean');
      result.valid.should.be.false;
      expect(result.error).to.exist;
      result.error.message.should.equal(
        '`fingerprint` must be a multibase encoded string.');
    });
    it('should reject an invalid fingerprint', async () => {
      const keyPair = await Ed25519VerificationKey2018.generate();
      const fingerprint = keyPair.fingerprint();
      // reverse the valid fingerprint
      const t = fingerprint.slice(1).split('').reverse().join('');
      const badFingerprint = fingerprint[0] + t;
      const result = keyPair.verifyFingerprint({fingerprint: badFingerprint});
      expect(result).to.exist;
      result.should.be.an('object');
      expect(result.valid).to.exist;
      result.valid.should.be.a('boolean');
      result.valid.should.be.false;
      expect(result.error).to.exist;
      result.error.message.should.equal(
        'The fingerprint does not match the public key.');
    });
    it('should reject a numeric fingerprint', async () => {
      const keyPair = await Ed25519VerificationKey2018.generate();
      const result = keyPair.verifyFingerprint({fingerprint: 123});
      expect(result).to.exist;
      result.should.be.an('object');
      expect(result.valid).to.exist;
      result.valid.should.be.a('boolean');
      result.valid.should.be.false;
      expect(result.error).to.exist;
      result.error.message.should.equal(
        '`fingerprint` must be a multibase encoded string.');
    });
    it('should reject an improperly encoded fingerprint', async () => {
      const keyPair = await Ed25519VerificationKey2018.generate();
      const result = keyPair.verifyFingerprint({fingerprint: 'zPUBLICKEYINFO'});
      expect(result).to.exist;
      result.should.be.an('object');
      expect(result.valid).to.exist;
      result.valid.should.be.a('boolean');
      result.valid.should.be.false;
      expect(result.error).to.exist;
      result.error.message.should.contain('must be Base58 encoded');
    });
    it('generates the same fingerprint from the same seed', async () => {
      const seed = new Uint8Array(32);
      seed.fill(0x01);
      const keyPair1 = await Ed25519VerificationKey2018.generate({seed});
      const keyPair2 = await Ed25519VerificationKey2018.generate({seed});
      const fingerprint = keyPair1.fingerprint();
      const fingerprint2 = keyPair2.fingerprint();
      const result = keyPair2.verifyFingerprint({fingerprint});
      expect(result).to.exist;
      result.should.be.an('object');
      expect(result.valid).to.exist;
      result.valid.should.be.a('boolean');
      result.valid.should.be.true;
      fingerprint.should.equal(fingerprint2);
    });
  });

  describe('static fromFingerprint', () => {
    it('should round-trip load keys', async () => {
      const keyPair = await Ed25519VerificationKey2018.generate();
      const fingerprint = keyPair.fingerprint();

      const newKey = Ed25519VerificationKey2018.fromFingerprint({fingerprint});
      expect(newKey.publicKeyBase58).to.equal(keyPair.publicKeyBase58);
    });
  });

  /* eslint-disable max-len */
  describe('static from', () => {
    it('should round-trip load exported keys', async () => {
      const keyPair = await Ed25519VerificationKey2018.generate();
      keyPair.id = '#test-id';
      const exported = await keyPair.export({
        publicKey: true, privateKey: true
      });
      const imported = await Ed25519VerificationKey2018.from(exported);

      expect(await imported.export({publicKey: true, privateKey: true}))
        .to.eql(exported);
    });

    it('should load from exported key storage format', async () => {
      const keyData = JSON.parse(`{
          "id": "did:v1:test:nym:z279nCCZVzxreYfLw3EtFLtBMSVVY2pA6uxKengriMCdG3DF#ocap-invoke-key-1",
          "type": "Ed25519VerificationKey2018",
          "controller": "did:v1:test:nym:z279nCCZVzxreYfLw3EtFLtBMSVVY2pA6uxKengriMCdG3DF",
          "publicKeyBase58": "5U6TbzeAqQtSq9N52XPHFrF5cWwDPHk96uJvKshP4jN5",
          "privateKeyBase58": "5hvHHCpocudyac6fT6jJCHe2WThQHsKYsjazkGV2L1Umwj5w9HtzcqoZ886yHJdHKbpC4W2qGhUMPbHNPpNDK6Dj"
        }`);

      const keyPair = await Ed25519VerificationKey2018.from(keyData);
      expect(keyPair.type).to.equal('Ed25519VerificationKey2018');
      expect(keyPair.id)
        .to.equal('did:v1:test:nym:z279nCCZVzxreYfLw3EtFLtBMSVVY2pA6uxKengriMCdG3DF#ocap-invoke-key-1');
      expect(keyPair.controller)
        .to.equal('did:v1:test:nym:z279nCCZVzxreYfLw3EtFLtBMSVVY2pA6uxKengriMCdG3DF');

      expect(keyPair.publicKeyBase58)
        .to.equal('5U6TbzeAqQtSq9N52XPHFrF5cWwDPHk96uJvKshP4jN5');
      expect(keyPair.privateKeyBase58)
        .to.equal('5hvHHCpocudyac6fT6jJCHe2WThQHsKYsjazkGV2L1Umwj5w9HtzcqoZ886yHJdHKbpC4W2qGhUMPbHNPpNDK6Dj');
    });
  }); // end static from
  /* eslint-enable max-len */
});
