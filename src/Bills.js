import React, { useEffect, useState } from 'react';

import { getKeysLS, setKeysLS } from './state/app';
import { near, contractAccount, KeyPair, networkId, contractId } from './state/near';

import { Bill } from './Bill'
import { Capture } from './Capture'
import OneDollar from './img/1-dollar.png'
import HundredDollar from './img/100-dollar.png'

export const Bills = ({ account }) => {

	if (!account) return <>
		<h3>NEAR Printer</h3>
		<p>First, sign in with your wallet.</p>
		<p>Print some bills using the printer!</p>
	</>

	const [keys, setKeys] = useState([])
	const [image, setImage] = useState(0)
	const [background, setBackground] = useState(1)
	const { accountId } = account

	const checkKeys = async (which) => {
		if (!which && keys.length > 0) return

		/// checks all keys
		if (!which) which = [...getKeysLS(accountId)]

		const invalidKeys = []
		await Promise.all(which.map(async (secretKey) => {
			try {
				const keyPair = KeyPair.fromString(secretKey)
				await account.viewFunction(contractId, 'get_key_balance', {
					key: keyPair.publicKey.toString()
				})
			} catch (e) {
				if (/Key missing/.test(e)) return invalidKeys.push(secretKey)
				throw e
			}
		}))

		const validKeys = [...getKeysLS(accountId)].filter((secretKey) => !invalidKeys.includes(secretKey))

		setKeys(validKeys);
		setKeysLS(accountId, validKeys);
	}
	useEffect(checkKeys, [])

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
							<Capture onClick={() => setImage(Math.random())} />
						</div>
						 <div>
							<img src={OneDollar} onClick={() => setBackground(1)} />
							<img src={HundredDollar} onClick={() => setBackground(100)} />
						</div>
					</div>

					<h3>Bills</h3>
					<div className="bills">
						<button onClick={async () => {

							for (let i = 0; i < keys.length; i++) {
								try {
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
									// console.log(res)
									checkKeys([secretKey])
								} catch (e) {
									if (/doesn't have access key/.test(e)) return console.log('invalid key')
									throw e
								}
							}

						}}>Reclaim All</button>
						{
							keys.map((secretKey, i) => {
								return <div key={secretKey}>
									<p>{i + 1} / {keys.length}</p>
									<Bill {...{
										image, background, secretKey, reclaimFunc: async () => {
											try {
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
												// console.log(res)
												checkKeys([secretKey])
											} catch (e) {
												if (/doesn't have access key/.test(e)) return console.log('invalid key')
												throw e
											}
										}
									}} />

								</div>
							})
						}
					</div>
				</>
				:
				<>
					<h3>NEAR Printer</h3>
					<p>Print some bills using the printer!</p>
				</>
		}
	</>
}