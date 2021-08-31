const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = window.screen.width;
canvas.height = window.screen.height;
const w = canvas.width;
const h = canvas.height;

const audioPlayer = document.getElementById("audioPlayer");

let audioCtx;
let audioSrc;
let analyser;

const fps = 60; //TODO get display fps
const screenSampleRate = fps*h;

function loadAudio() {
	audioPlayer.src = URL.createObjectURL(document.getElementById("fileInput").files[0]);

	if (!audioCtx) {
		audioCtx = new AudioContext();
		audioSrc = audioCtx.createMediaElementSource(audioPlayer);
		analyser = audioCtx.createAnalyser();
		audioSrc.connect(analyser);
		audioSrc.connect(audioCtx.destination);
		analyser.fftSize = 2048;
	}

	let waveData = new Uint8Array(analyser.frequencyBinCount);
	const sampleRateRatio = screenSampleRate/audioCtx.sampleRate;

	audioPlayer.play()
	canvas.requestFullscreen();

	const ctx = canvas.getContext("2d");
	
	function drawFrame() {
		analyser.getByteTimeDomainData(waveData);
		ctx.clearRect(0,0,w,h);

		for (let x=1; x<=h; x++) {
			ctx.beginPath();
			ctx.strokeStyle = (waveData[Math.floor(x/sampleRateRatio)+1]<128) ? "white" : "black";
			ctx.moveTo(0,x);
			ctx.lineTo(w,x);
			ctx.stroke();
		}
		requestAnimationFrame(drawFrame);
	}
	drawFrame();

}
