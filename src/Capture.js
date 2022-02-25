import React, { useEffect, useState } from 'react';

export const Capture = ({ onClick }) => {

	const onMount = async () => {

		let width = 320;    // We will scale the photo width to this
		let height = 0;     // This will be computed based on the input stream

		// The various HTML elements we need to configure or control. These
		// will be set by the startup() function.

		let streaming = false, video, canvas, photo, overlay, startbutton;

		function showViewLiveResultButton() {
			if (window.self !== window.top) {
				// Ensure that if our document is in a frame, we get the user
				// to first open it in its own tab or window. Otherwise, it
				// won’t be able to request permission for camera access.
				document.querySelector(".contentarea").remove();
				const button = document.createElement("button");
				button.textContent = "View live result of the example code above";
				document.body.append(button);
				button.addEventListener('click', () => window.open(location.href));
				return true;
			}
			return false;
		}

		function startup() {
			if (showViewLiveResultButton()) { return; }
			video = document.getElementById('video');
			canvas = document.getElementById('canvas');
			overlay = document.getElementById('overlay');
			photo = document.getElementById('photo');
			startbutton = document.getElementById('startbutton');

			navigator.mediaDevices.getUserMedia({ video: true, audio: false })
			.then(function (stream) {
				video.srcObject = stream;
				video.play();
			})
			.catch(function (err) {
				console.log("An error occurred: " + err);
			});
			

			video.addEventListener('canplay', function (ev) {
				if (!streaming) {
					height = video.videoHeight / (video.videoWidth / width);

					// Firefox currently has a bug where the height can't be read from
					// the video, so we will make assumptions if this happens.

					if (isNaN(height)) {
						height = width / (4 / 3);
					}

					video.setAttribute('width', width);
					video.setAttribute('height', height);
					overlay.setAttribute('width', width);
					overlay.setAttribute('height', height);
					canvas.setAttribute('width', width);
					canvas.setAttribute('height', height);
					streaming = true;
				}
			}, false);

			startbutton.addEventListener('click', function (ev) {
				onClick()
				takepicture();
				ev.preventDefault();
			}, false);
		}
		startup()

		function updateOverlay() {

		}

		// Capture a photo by fetching the current contents of the video
		// and drawing it into a canvas, then converting that to a PNG
		// format data URL. By drawing it on an offscreen canvas and then
		// drawing that to the screen, we can change its size and/or apply
		// other changes before drawing it.

		function takepicture() {
			let context = canvas.getContext('2d');
			if (width && height) {
				canvas.width = width;
				canvas.height = height;
				context.drawImage(video, 0, 0, width, height);
				// var data = canvas.toDataURL('image/png');
				// photo.setAttribute('src', data);
			}

			context = overlay.getContext('2d');
			if (width && height) {
				overlay.width = width;
				overlay.height = height;
				context.strokeStyle = 'red'
				context.arc(width/2, height/2 - height/8, width/4, 0, Math.PI*2)
				context.stroke()
			}
		}

		setTimeout(takepicture, 1000)
	}
	useEffect(onMount, [])

	return <>

		<div className="camera">
			<video id="video">Video stream not available.</video>
  			<canvas id="overlay"></canvas>
  			<canvas id="canvas" className="display-none"></canvas>
			<br />
			<button id="startbutton">Take photo</button>
		</div>

	</>
}