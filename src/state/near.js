import * as nearAPI from 'near-api-js';
import { near, contractAccount } from '../../utils/near-utils';
import getConfig from '../../utils/config';
const networkId = process.env.REACT_APP_ENV === 'prod' ? 'mainnet' : 'testnet'
const { contractId, gas } = getConfig(networkId);
const { KeyPair, WalletAccount, utils: { format: { parseNearAmount } } } = nearAPI

export { near, networkId, contractAccount, KeyPair, parseNearAmount, contractId, gas }

export const initNear = () => async ({ update }) => {

	const wallet = new WalletAccount(near)

	wallet.signIn = () => {
		wallet.requestSignIn(contractId, 'Blah Blah');
	};
	const signOut = wallet.signOut;
	wallet.signOut = () => {
		signOut.call(wallet);
		wallet.signedIn = false
		update('', { account: null, wallet });
		location.reload()
	};

	wallet.signedIn = wallet.isSignedIn();
    
	let account;
	if (wallet.signedIn) {
		account = wallet.account();
		wallet.account = account
	}

	await update('', { near, wallet, account });

};
