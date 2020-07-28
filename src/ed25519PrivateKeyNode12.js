/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
import {createPrivateKey} from 'crypto';
import {privateKeyDerEncode} from './util.js';

export default function create({privateKeyBytes, seedBytes}) {
  return createPrivateKey({
    key: privateKeyDerEncode({privateKeyBytes, seedBytes}),
    format: 'der',
    type: 'pkcs8'
  });
}
