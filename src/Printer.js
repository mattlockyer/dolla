import React, { useEffect, useState } from 'react';
import BN  from 'bn.js'

import { getKeysLS, setKeysLS } from './state/app';
import { parseNearAmount, KeyPair, contractId, gas } from './state/near';

export const Printer = ({ account }) => {

	if (!account) return null

	const { accountId } = account
	const [num, setNum] = useState('1')
	const [amount, setAmount] = useState('0.02')

	const onMount = async () => {
		
	}
	useEffect(onMount, [])

	return <>
		<h3>Printer</h3>
		<p>Amount</p>
		<input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
		<p>Number</p>
		<input type="number" value={num} onChange={(e) => setNum(e.target.value)} />
		<button onClick={() => {
			const keysLS = getKeysLS(accountId)
			const keys = []
			for (let i = 0; i < num; i++) {
				const keyPair = KeyPair.fromRandom('ed25519')
				keys.push(keyPair)
				keysLS.push(keyPair.secretKey)
			}
			setKeysLS(accountId, keysLS)

			account.functionCall({
				contractId,
				methodName: 'send_multiple',
				args: {
					public_keys: keys.map((keyPair) => keyPair.publicKey.toString())
				},
				gas,
				attachedDeposit: new BN(parseNearAmount(amount)).mul(new BN(num))
			})
		}}>Print</button>
	</>
}