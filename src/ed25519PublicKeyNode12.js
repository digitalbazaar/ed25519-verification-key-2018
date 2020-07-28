/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
import {createPublicKey} from 'crypto';
import {publicKeyDerEncode} from './util.js';

export default function create({publicKeyBytes}) {
  return createPublicKey({
    key: publicKeyDerEncode({publicKeyBytes}),
    format: 'der',
    type: 'spki'
  });
}
