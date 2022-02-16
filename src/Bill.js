import React, { useEffect, useState, useRef } from 'react';

import { contractId } from './state/near'

const WIDTH = 846, HEIGHT = 360

export const Bill = ({ image, background, secretKey }) => {

	const qr = useRef();
	const canvas = useRef();

	const onMount = async () => {
		const url = `https://wallet.near.org/linkdrop/${contractId}/${secretKey}`
		new QRCode(qr.current, {
			text: url,
			width: 256,
			height: 256,
			colorDark : "#444422",
			colorLight : "#FFFFFF88",
			correctLevel : QRCode.CorrectLevel.M
		});
	}
	useEffect(onMount, [])

	const onImage = () => {
		
		const photo = document.getElementById('canvas');
		const image = document.getElementById(background + '-dollar');
		const c = canvas.current;
		c.width = WIDTH;
		c.height = HEIGHT;
		const ctx = c.getContext('2d');

		if (background === 1) {
			ctx.drawImage(photo, 0, 0, photo.width, photo.height, WIDTH/2 - photo.width/2, 100, photo.width, photo.height);
			ctx.drawImage(image, 0, 0);
	
			const q = qr.current.children[0]
			ctx.drawImage(q, 0, 0, q.width, q.height, 117, 105, 200, 200);
			ctx.drawImage(q, 0, 0, q.width, q.height, 535, 105, 200, 200);
		} else {
			ctx.fillStyle = 'white'
			ctx.fillRect(0, 0, WIDTH*2, HEIGHT*2)
			ctx.drawImage(photo, 0, 0, photo.width, photo.height, WIDTH/2 - photo.width/2 - 60, 20, photo.width, HEIGHT - 50);
			ctx.drawImage(image, 0, 0);

			const q = qr.current.children[0]
			ctx.drawImage(q, 0, 0, q.width, q.height, 28, 80, 200, 200);
			ctx.drawImage(q, 0, 0, q.width, q.height, 506, 111, 190, 190);
		}

		
	}
	useEffect(onImage, [image, background])

	return <div>
		<div ref={qr} className="display-none"></div>
		<canvas ref={canvas} width={WIDTH} height={HEIGHT}></canvas>
	</div>
}