/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {createPrivateKey} from 'crypto';
import {privateKeyDerEncode} from './util';

export default function create({privateKeyBytes, seedBytes}) {
  return createPrivateKey({
    key: privateKeyDerEncode({privateKeyBytes, seedBytes}),
    format: 'der',
    type: 'pkcs8'
  });
}
