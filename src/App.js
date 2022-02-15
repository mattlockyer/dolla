import React, { useContext, useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { appStore, onAppMount } from './state/app';
import { Bills } from './Bills'
import { Printer } from './Printer'
import './App.scss';

const App = () => {
	const { state, dispatch, update } = useContext(appStore);

	const { wallet, account } = state

	const onMount = () => {
		dispatch(onAppMount());
	};
	useEffect(onMount, []);

	return (
		<div>

			<nav>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/wallet">Wallet</Link>
					</li>
					<li>
						<Link to="/printer">Printer</Link>
					</li>
					<li>
						<Link to="/bills">Bills</Link>
					</li>
				</ul>
			</nav>

			<Routes>
				<Route path="/wallet" element={
					account ?
						<>
							<h2>Wallet</h2>
							<p>{account.accountId}</p>
							<button onClick={() => wallet.signOut()}>Sign Out</button>
						</>
						:
						<>
							<h2>Wallet</h2>
							<p>Not Signed In</p>
							<button onClick={() => wallet.signIn()}>Sign In</button>
						</>
				} />
				<Route path="/bills" element={<Bills {...{ account } } />} />
				<Route path="/printer" element={<Printer {...{ account } } />} />
				<Route path="/" element={
					<p>Hello</p>
				} />
			</Routes>

		</div>
	);
};

export default App;
