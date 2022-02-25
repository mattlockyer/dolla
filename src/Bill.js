import React, { useEffect, useRef } from 'react';
import copy from "copy-to-clipboard";

import { contractId } from './state/near'

const WIDTH = 846, HEIGHT = 360
const TRY_URL = 'https://www.nearprinter.com'

export const Bill = ({ image, background, secretKey, reclaimFunc }) => {

	const qr = useRef();
	const canvas = useRef();

	const url = `https://wallet.near.org/linkdrop/${contractId}/${secretKey}`

	const onMount = async () => {
		if (qr.current.children.length < 2) {
			new QRCode(qr.current, {
				text: url,
				width: 256,
				height: 256,
				colorDark: "#444422",
				colorLight: "#FFFFFF88",
				correctLevel: QRCode.CorrectLevel.M
			});
			new QRCode(qr.current, {
				text: TRY_URL,
				width: 256,
				height: 256,
				colorDark: "#444422",
				colorLight: "#FFFFFF88",
				correctLevel: QRCode.CorrectLevel.M
			});
		}
		console.log(qr.current)
	}
	useEffect(onMount, [])

	const onImage = () => {

		const photo = document.getElementById('canvas');
		const image = document.getElementById(background + '-dollar');
		const c = canvas.current;
		c.width = WIDTH;
		c.height = HEIGHT;
		const ctx = c.getContext('2d');

		ctx.fillStyle = '#FFF'
		ctx.fillRect(0, 0, WIDTH, HEIGHT)

		console.log(photo.width, photo.height)

		let margin = Math.max(0, photo.height - photo.width) / 2

		if (background === 1) {
			ctx.drawImage(photo, 0, margin, photo.width, photo.height - margin * 2, WIDTH / 2 - photo.width / 2, 100, photo.width, photo.height - margin * 2);
			ctx.drawImage(image, 0, 0);

			let q = qr.current.children[0]
			ctx.drawImage(q, 0, 0, q.width, q.height, 117, 105, 200, 200);
			q = qr.current.children[2]
			ctx.drawImage(q, 0, 0, q.width, q.height, 535, 105, 200, 200);
		} else {
			ctx.fillStyle = 'white'
			ctx.fillRect(0, 0, WIDTH * 2, HEIGHT * 2)
			ctx.drawImage(photo, 0, 0, photo.width, photo.height, WIDTH / 2 - photo.width / 2 - 60, 20, photo.width, HEIGHT - 50);
			ctx.drawImage(image, 0, 0);

			let q = qr.current.children[0]
			ctx.drawImage(q, 0, 0, q.width, q.height, 28, 80, 200, 200);
			q = qr.current.children[2]
			ctx.drawImage(q, 0, 0, q.width, q.height, 506, 111, 190, 190);
		}
	}
	useEffect(onImage, [image, background])

	return <div>
		<div ref={qr} className="display-none"></div>
		<canvas ref={canvas} width={WIDTH} height={HEIGHT}></canvas>
		<button onClick={() => {

			// Default export is a4 paper, portrait, using millimeters for units
			const doc = new jspdf.jsPDF({
				orientation: "landscape",
				unit: "px",
				format: [WIDTH, HEIGHT + 25]
			});

			const c = canvas.current;
			var myImage = c.toDataURL("image/jpeg");
			doc.addImage(myImage, 'JPEG', 0, 25, WIDTH, HEIGHT);
			doc.setTextColor(0, 0, 255);
			doc.textWithLink(url, 15, 15, { url });
			// doc.link(10, 10, WIDTH, 100, { url });
			doc.save("a4.pdf");
		}}>Download PDF</button>

		<button onClick={async () => {
			if (window.navigator.share) {
				await window.navigator.share({
					title: 'You received a NEAR Bill!',
					text: 'Click this link to claim!',
					url,
				});
			} else {
				copy(url)
				alert('Link Copied!')
			}
		}}>Claim Link</button>
		<button onClick={reclaimFunc}>Reclaim Bill</button>
	</div>
}