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

		setKeys(validKeys);
		setKeysLS(validKeys);
	}
	useEffect(onMount, [])

	return <>

		<div style={{ display: 'none' }}>
			<img id="1-dollar" src={OneDollar} onClick={() => setBackground(1)} />
			<img id="100-dollar" src={HundredDollar} onClick={() => setBackground(100)} />
		</div>

		{
			keys.length > 0
				?
				<>
					<h3>Style</h3>

					<div className="style">
						<div>
							<img src={OneDollar} onClick={() => setBackground(1)} />
							<img src={HundredDollar} onClick={() => setBackground(100)} />
						</div>
						<div>
							<Capture onClick={() => setImage(Math.random())} />
						</div>
					</div>

					<h3>Bills</h3>
					<div className="bills">
						<button onClick={async () => {

							for (let i = 0; i < keys.length; i++) {
								const secretKey = keys[i]
								const keyPair = KeyPair.fromString(secretKey)
								near.connection.signer.keyStore.setKey(networkId, contractId, keyPair);
								const res = await contractAccount.functionCall({
									contractId,
									methodName: 'claim',
									args: {
										account_id: account.accountId
									},
								})

								console.log(res)
								onMount(true)
							}

						}}>Reclaim All</button>
						{
							keys.map((secretKey, i) => {
								return <div key={secretKey}>
									<p>{i + 1} / { keys.length }</p>
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
										}}>Reclaim Bill</button>
									</div>

								</div>
							})
						}
					</div>
				</>
				:
				<p>Print some bills using the printer!</p>
		}
	</>
}