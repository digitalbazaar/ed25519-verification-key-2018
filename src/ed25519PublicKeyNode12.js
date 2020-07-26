/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {createPublicKey} from 'crypto';
import {publicKeyDerEncode} from './util';

export default function create({publicKeyBytes}) {
  return createPublicKey({
    key: publicKeyDerEncode({publicKeyBytes}),
    format: 'der',
    type: 'spki'
  });
}
