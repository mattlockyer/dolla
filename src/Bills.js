import React, { useEffect, useState } from 'react';

import { getKeysLS, setKeysLS } from './state/app';
import { near, contractAccount, KeyPair, networkId, contractId, gas } from './state/near';

export const Bills = ({ account }) => {

	if (!account) return null

	const [keys, setKeys] = useState([])

	const onMount = async (force) => {
		if (!force && keys.length > 0) return
		const validKeys = []
		const keysLS = getKeysLS()
		await Promise.all(keysLS.map(async (key) => {
			try {
				const keyPair = KeyPair.fromString(key)
				await account.viewFunction(contractId, 'get_key_balance', {
					key: keyPair.publicKey.toString()
				})
				validKeys.push(key)
			} catch (e) {
				if (/Key missing/.test(e)) return console.log('Key missing from contract:', key)
				throw e
			}
		}))
		console.log('validKeys', validKeys)
		setKeys(validKeys)
		setKeysLS(validKeys)
	}
	useEffect(onMount, [])

	return <>
		<h2>Bills</h2>
		{
			keys.map((key, i) => {
				return <div key={key}>
					<p>Bill #{i + 1}</p>
					<button onClick={async () => {
						const keyPair = KeyPair.fromString(key)
						near.connection.signer.keyStore.setKey(networkId, contractId, keyPair);
						const res = await contractAccount.functionCall({
							contractId,
							methodName: 'claim',
							args: {
								account_id: account.accountId
							},
							// gas,
						})
						console.log(res)
						onMount(true)
					}}>Claim</button>

				</div>
			})
		}
	</>
}