import React, { useEffect, useState } from 'react';

import { getKeysLS, setKeysLS } from './state/app';
import { parseNearAmount, KeyPair, contractId, gas } from './state/near';

export const Printer = ({ account }) => {

	if (!account) return null

	const [num, setNum] = useState(1)

	const onMount = async () => {
		
	}
	useEffect(onMount, [])

	return <>
		<h2>Printer</h2>
		<input type="number" value={num} onChange={(e) => setNum(e.target.value)} />
		<button onClick={() => {
			const keysLS = getKeysLS()
			const keys = []
			for (let i = 0; i < num; i++) {
				const keyPair = KeyPair.fromRandom('ed25519')
				keys.push(keyPair)
				keysLS.push(keyPair.secretKey)
			}
			setKeysLS(keysLS)

			account.functionCall({
				contractId,
				methodName: 'send_multiple',
				args: {
					public_keys: keys.map((keyPair) => keyPair.publicKey.toString())
				},
				gas,
				attachedDeposit: parseNearAmount((num * 0.02).toString())
			})
		}}>Print</button>
	</>
}