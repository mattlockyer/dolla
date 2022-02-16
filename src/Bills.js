import React, { useEffect, useState } from 'react';

import { getKeysLS, setKeysLS } from './state/app';
import { near, contractAccount, KeyPair, networkId, contractId, gas } from './state/near';

import { Bill } from './Bill'
import { Capture } from './Capture'
import OneDollar from './img/1-dollar.png'
import HundredDollar from './img/100-dollar.png'

export const Bills = ({ account }) => {

	if (!account) return null

	const [keys, setKeys] = useState([])
	const [image, setImage] = useState(0)
	const [background, setBackground] = useState(1)

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

		setKeys(validKeys);
		setKeysLS(validKeys);
	}
	useEffect(onMount, [])

	return <>

		<h2>Style</h2>

		<div className="style">
			<div>

				<img id="1-dollar" src={OneDollar} onClick={() => setBackground(1)} />
				<img id="100-dollar" src={HundredDollar} onClick={() => setBackground(100)} />
			</div>
			<div>
				<Capture onClick={() => setImage(Math.random())} />
			</div>
		</div>

		<h2>Bills</h2>
		{
			keys.map((secretKey, i) => {
				return <div key={secretKey}>
					{/* <p>Bill #{i + 1}</p> */}
					<Bill {...{ image, background, secretKey }} />
					<div>
						<button onClick={async () => {
							const keyPair = KeyPair.fromString(secretKey)
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

				</div>
			})
		}
	</>
}