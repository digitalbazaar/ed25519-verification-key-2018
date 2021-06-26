# Ed25519VerificationKey2018 Key Pair Library for Linked Data _(@digitalbazaar/ed25519-verification-key-2018)_

[![Node.js CI](https://github.com/digitalbazaar/ed25519-verification-key-2018/workflows/Node.js%20CI/badge.svg)](https://github.com/digitalbazaar/ed25519-verification-key-2018/actions?query=workflow%3A%22Node.js+CI%22)

> Javascript library for generating and working with Ed25519VerificationKey2018 key pairs, for use with crypto-ld.

## Table of Contents

- [Background](#background)
- [Security](#security)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [Commercial Support](#commercial-support)
- [License](#license)

## Background

See also (related specs):

* [Linked Data Cryptographic Suite Registry](https://w3c-ccg.github.io/ld-cryptosuite-registry/)

## Security

As with most security- and cryptography-related tools, the overall security of
your system will largely depend on your design decisions.

## Install

- Node.js 12+ is required.

To install locally (for development):

```
git clone https://github.com/digitalbazaar/ed25519-verification-key-2018.git
cd ed25519-verification-key-2018
npm install
```

## Usage

### Generating a new public/private key pair

To generate a new public/private key pair:

* `{string} [controller]` Optional controller URI or DID to initialize the
  generated key. (This will also init the key id.) 
* `{string} [seed]` Optional deterministic seed value from which to generate the 
  key.

```js
import {Ed25519VerificationKey2018} from '@digitalbazaar/ed25519-verification-key-2018';

const edKeyPair = await Ed25519VerificationKey2018.generate();
```

### Importing a key pair from storage

To create an instance of a public/private key pair from data imported from
storage, use `.from()`:

```js
const serializedKeyPair = { ... };

const keyPair = await Ed25519VerificationKey2018.from(serializedKeyPair);
```

Note that only installed key types are supported, if you try to create a
key pair via `from()` for an unsupported type, an error will be thrown.

### Exporting the public key only

To export just the public key of a pair:

```js
await keyPair.export({publicKey: true});
// ->
{ 
  id: 'did:ex:123#z6MkumafR1duPR5FZgbVu8nzX3VyhULoXNpq9rpjhfaiMQmx',
  controller: 'did:ex:123',
  type: 'Ed25519VerificationKey2018',
  publicKeyBase58: 'GKKcpmPU3sanTBkoDZq9fwwysu4x7VaUTquosPchSBza'
}
*/
```

### Exporting the full public-private key pair

To export the full key pair, including private key (warning: this should be a
carefully considered operation, best left to dedicated Key Management Systems):

```js
await keyPair.export({publicKey: true, privateKey: true});
// ->
{
  id: 'did:ex:123#z6Mks8wJbzhWdmkQZgw7z2qHwaxPVnFsFmEZSXzGkLkvhMvL',
  controller: 'did:ex:123',
  type: 'Ed25519VerificationKey2018',
  publicKeyBase58: 'DggG1kT5JEFwTC6RJTsT6VQPgCz1qszCkX5Lv4nun98x',
  privateKeyBase58: 'sSicNq6YBSzafzYDAcuduRmdHtnrZRJ7CbvjzdQhC45ewwvQeuqbM2dNwS9RCf6buUJGu6N3rBy6oLSpMwha8tc'
}
```

### Generating and verifying key fingerprint

To generate a fingerprint:

```js
keyPair.fingerprint();
// ->
'z6Mks8wJbzhWdmkQZgw7z2qHwaxPVnFsFmEZSXzGkLkvhMvL'
```

To verify a fingerprint:

```js
const fingerprint = 'z6Mks8wJbzhWdmkQZgw7z2qHwaxPVnFsFmEZSXzGkLkvhMvL';
keyPair.verifyFingerprint({fingerprint});
// ->
{ valid: true }
```

### Creating a signer function

In order to perform a cryptographic signature, you need to create a `sign`
function, and then invoke it.

```js
const keyPair = Ed25519VerificationKey2018.generate();

const {sign} = keyPair.signer();

const data = 'test data to sign';
const signatureValue = await sign({data});
```

### Creating a verifier function

In order to verify a cryptographic signature, you need to create a `verify`
function, and then invoke it (passing it the data to verify, and the signature).

```js
const keyPair = Ed25519VerificationKey2018.generate();

const {verify} = keyPair.verifier();

const {valid} = await verify({data, signature});
```

## Contribute

See [the contribute file](https://github.com/digitalbazaar/bedrock/blob/master/CONTRIBUTING.md)!

PRs accepted.

If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Commercial Support

Commercial support for this library is available upon request from
Digital Bazaar: support@digitalbazaar.com

## License

[New BSD License (3-clause)](LICENSE) © Digital Bazaar
