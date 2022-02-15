const contractName = 'ld.dolla.near';

module.exports = function getConfig(networkId = 'testnet') {
	let config = {
		networkId,
		nodeUrl: "https://rpc.testnet.near.org",
		walletUrl: "https://wallet.testnet.near.org",
		helperUrl: "https://helper.testnet.near.org",
		contractName,
	};

	if (networkId) {
		config = {
			...config,
			GAS: "200000000000000",
			gas: "200000000000000",
			attachedDeposit: '10000000000000000000000', // 0.01 N (1kb storage)
			contractId: contractName,
			isBrowser: new Function("try {return this===window;}catch(e){ return false;}")()
		}
	}

	switch (networkId) {
		case 'testnet':
			config = {
				...config,
				networkId,
				explorerUrl: "https://explorer.testnet.near.org",
			};
			break;

		case 'mainnet':
			config = {
				...config,
				networkId,
				explorerUrl: "https://explorer.near.org",
				nodeUrl: "https://rpc.mainnet.near.org",
				walletUrl: "https://wallet.near.org",
				helperUrl: "https://helper.mainnet.near.org",
			};
			break;
	}

	return config;
};
