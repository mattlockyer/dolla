import React, { useContext, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { appStore, onAppMount } from './state/app';
import { Bills } from './Bills'
import { Printer } from './Printer'
import IlliaPrinter from 'url:./img/illia-printer-small.gif'
import Sample from 'url:./img/sample.png'
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
					<Link to="/">About</Link>
				</li>

				{
					account && <>
						<li>
							<Link to="/bills">Bills</Link>
						</li>
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
					<Route path="/bills" element={<Bills {...{ account }} />} />
					<Route path="/" element={<>
						<h3>NEAR Printer</h3>
						<img src={IlliaPrinter} />
						<p></p>
						<p>Sign in and use the printer to create "NEAR Bills".</p>
						<img src={Sample} />
						<p></p>
						{
							account
								?
								<Link to="/printer"><button>Print Bills</button></Link>
								:
								<button onClick={() => wallet.signIn()}>Sign In</button>
						}
						<p>You can download the image, a PDF with link, or share the link directly without the image.</p>
						<p>Print and be merry!</p>
						
					</>} />
				</Routes>
			</main>

		</div>
	</>
};

export default App;
