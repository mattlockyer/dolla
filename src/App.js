import React, { useContext, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { appStore, onAppMount } from './state/app';
import { Bills } from './Bills'
import { Printer } from './Printer'
import './App.scss';

const Wallet = ({ wallet }) => {
	return wallet?.signedIn ?
		<>
			<h2>Wallet</h2>
			<p>{wallet.account.accountId}</p>
			<Link to="/printer"><button>Print Bills</button></Link>
			<button onClick={() => wallet.signOut()}>Sign Out</button>
		</>
		:
		<>
			<h2>Wallet</h2>
			<p>Not Signed In</p>
			<button onClick={() => wallet.signIn()}>Sign In</button>
		</>
}

const App = () => {
	const { state, dispatch, update } = useContext(appStore);

	const { wallet, account } = state

	const { href, pathname } = window.location;
	const txHashes = href.split('?transactionHashes=')[1];
	const navigate = useNavigate();

	const onMount = () => {
		dispatch(onAppMount());
		if (pathname !== '/' && txHashes?.length > 0) {
			navigate('/');
		}
	};
	useEffect(onMount, []);

	return <>
		<div className="background"></div>

		<nav>
			<ul>
				<li>
					<Link to="/">Bills</Link>
				</li>
				{
					account && <>
						<li>
							<Link to="/printer">Printer</Link>
						</li>
					</>
				}
				<li>
					<Link to="/wallet">Wallet</Link>
				</li>
			</ul>
		</nav>



		<div className='container-fluid'>


			<main>
				<Routes>
					<Route path="/printer" element={<Printer {...{ account }} />} />

					<Route path="/wallet" element={<Wallet {...{ wallet }} />} />

					<Route path="/" element={<Bills {...{ account }} />} />
				</Routes>
			</main>

		</div>
	</>
};

export default App;
