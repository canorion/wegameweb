const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

var homeTeam = params.home_team;
var awayTeam = params.away_team;

function getHomeTeam() {
	return homeTeam;
}

function getAwayTeam() {
	return awayTeam;
}

deviceId = 'default';
/*Clap Analysis*/
async function sendAudioChunks(audioChunks) {
	//logAudioPageAsBlob(audioChunks);

	const formData = new FormData();
	formData.append('audio', new Blob(audioChunks, { type: 'audio/webm' }));

	try {
		const response = await fetch('http://localhost:9000/clap', {
			method: 'POST',
			body: formData,
		});

		if (response.ok) {
			let res = await response.json();
			console.log("clap", res.score);
			godotBridge.test({ message: "db_level", value: res.score });
		} else {
			console.error('Error sending audio:', response.status, response.statusText);
		}
	} catch (error) {
		console.error('Error sending audio:', error);
	}
}
function logAudioPageAsBlob(audioChunks) {
	const blob = new Blob(audioChunks, { type: 'audio/webm' });

	// Create the div element
	var audioPlayerDiv = document.createElement('div');
	audioPlayerDiv.id = 'audioPlayer';
	audioPlayerDiv.style.position = 'fixed';
	audioPlayerDiv.style.zIndex = 1000;

	// Create the audio element
	var audioElement = document.createElement('audio');
	audioElement.id = 'player';
	audioElement.controls = true;

	// Append the audio element to the div
	audioPlayerDiv.appendChild(audioElement);

	// Append the div to the body
	document.body.appendChild(audioPlayerDiv);

	// Create a source element and set the Blob URL as the source
	const source = document.createElement('source');
	source.src = URL.createObjectURL(blob);
	source.type = 'audio/webm';

	// Append the source element to the audio element
	audioElement.appendChild(source);
}
function listAndChooseMicrophone() {
	return new Promise((resolve, reject) => {
		navigator.mediaDevices.enumerateDevices()
			.then(devices => {
				const audioDevices = devices.filter(device => device.kind === 'audioinput');

				if (audioDevices.length === 0) {
					console.error('No microphone devices found.');
					reject('default');
					return;
				}
				//remove default device
				audioDevices.shift();
				if (audioDevices.length === 1) {
					resolve(audioDevices[0].deviceId);
					return;
				}

				// Present the list of microphones to the user for selection
				const selectedDeviceId = promptMicrophoneSelection(audioDevices);

				if (selectedDeviceId) {
					resolve(selectedDeviceId);
				} else {
					console.error('User canceled microphone selection.');
					reject('default')
				}
			})
			.catch(error => {
				console.error('Error enumerating audio devices:', error);
			});
	});
}

function promptMicrophoneSelection(audioDevices) {
	const options = audioDevices.map(device => ({
		label: device.label || `Microphone ${device.deviceId}`,
		value: device.deviceId,
	}));

	const selection = prompt(options.map((opt, index) => `${index + 1}. ${opt.label}`).join('\n'));

	if (selection && Number.isInteger(parseInt(selection)) && parseInt(selection) >= 1 && parseInt(selection) <= options.length) {
		return options[parseInt(selection) - 1].value;
	}

	return null; // User canceled or provided invalid input
}



//bu fonksiyon mikrosonfdan ses parçası kaydedip clap  analiz servisine gönderiyor bunu şut atarken çağıracağız

function startClapAnalysis() {
	var mediaRecorder;
	var audioChunks = [];
	navigator.mediaDevices.getUserMedia({ audio: true })
		.then(stream => {
			mediaRecorder = new MediaRecorder(stream);
			mediaRecorder.addEventListener('dataavailable', (event) => {
				if (event.data.size > 0) {
					console.log("audio chunk received");
					audioChunks.push(event.data);
				}
			});

			mediaRecorder.addEventListener('stop', () => {
				sendAudioChunks(audioChunks);
				console.log("send audio chunks to clap analysis service");
				audioChunks = [];
			});

			mediaRecorder.start();
			console.log("start recording");
			setTimeout(() => {
				mediaRecorder.stop();
				console.log("stop recording");
			}, 3000);
		})
		.catch(error => {
			console.error('Error accessing microphone:', error);
		});
}

/*Volume Level Analysis*/
//bu fonksiyonu sayfa yüklendiğinde çağırıyoruz sürekli bir şekilde mikrofondan gelen sesi analiz edip ses seviyesini güncelliyor
function startVolumeterAnalyze() {
	navigator.mediaDevices.getUserMedia({ audio: true })
		.then(stream => {
			const audioContext = new AudioContext();
			const analyser = audioContext.createAnalyser();
			const microphone = audioContext.createMediaStreamSource(stream);
			microphone.connect(analyser);

			analyser.fftSize = 256;
			const bufferLength = analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			const updateDBFS = () => {
				analyser.getByteFrequencyData(dataArray);
				const maxLevel = Math.max(...dataArray);
				const normalizedLevel = (maxLevel / 255) * 100;
				godotBridge.test({ message: "db_level_update", value: normalizedLevel });
				//console.log("db_level_update",normalizedLevel);					
				setTimeout(() => {
					requestAnimationFrame(updateDBFS);
				}, 200);
			};

			updateDBFS();
		})
		.catch(error => {
			console.error('Error accessing microphone:', error);
		});
}
function startRecording() {
	startClapAnalysis();
}
window.document.addEventListener('DOMContentLoaded', async () => {
	console.log("game.js loaded");
	deviceId = await listAndChooseMicrophone();
	console.log(deviceId);

	//startVolumeterAnalyze();
});
