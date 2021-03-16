# ed25519-verification-key-2018 Changelog

## 3.0.0 - 2021-03-16

## Changed
- Update to use `crypto-ld v5.0`.
- **BREAKING**: Removed helper methods `addPublicKey` and `addPrivateKey`.

## 2.0.0 - 2021-02-27

## Added
- **BREAKING**: Using @stablelib/ed25519 over node-forge.
- **BREAKING**: Using `base58-universal` over `bs58`.
- Added new files `ed25519.js` and `ed25519-browser.js` to `/src`.

## Removed
- **BREAKING**: Removed public export of privateKeyDerEncode & publicKeyDerEncode.
- **BREAKING**: Removed `node-forge` from the project.
- **BREAKING**: Removed `semver` from the project.
- **BREAKING**: Removed `bs58` from project.
- **BREAKING**: Removed `src/ed25519PrivateKeyNode12.js`.
- **BREAKING**: Removed `src/ed25519PublicKeyNode12.js`.

## Changed
- **BREAKING**: Browser must supply `crypto.getRandomValues`.
- This library now switches between 2 different ed25519.js files for
  key generation when in node or the browser.
- `privateKeyDerEncode` now only accepts Uint8Arrays.
- `publicKeyDerEncode` now only accepts Uint8Arrays. 

## 1.1.0 - 2020-10-20

### Changed
- Use node-forge@0.10.0.

## 1.0.2 - 2020-08-03

### Changed
- Fix karma tests, package.json export.

## 1.0.1 - 2020-08-01

### Changed
- Fix ESM import error.

## 1.0.0 - 2020-08-01

### Added
- Initial commit. Extracted from
  [`crypto-ld`](https://github.com/digitalbazaar/crypto-ld)), for previous
  commit history, see that repo.

### Changed
- **BREAKING**: Removed deprecated `from()` params (`keyType` and
  `privateKey` object).
- See also [`crypto-ld` v4.0 Changelog](https://github.com/digitalbazaar/crypto-ld/blob/master/CHANGELOG.md#400---2020-08-01)

### Purpose and Upgrade Instructions

See [`crypto-ld` v4.0 Purpose](https://github.com/digitalbazaar/crypto-ld/blob/master/CHANGELOG.md#400---purpose)
and [`crypto-ld` Upgrade from v3.7 notes](https://github.com/digitalbazaar/crypto-ld/blob/master/CHANGELOG.md#upgrading-from-v370)
