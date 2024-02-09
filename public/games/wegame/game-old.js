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
 

asdf

// Function to send audio chunks to the FastAPI endpoint
/*async function sendAudioChunks(audioChunks) {
  const formData = new FormData();
  formData.append('audio', new Blob(audioChunks, { type: 'audio/webm' }));

  try {
	const response = await fetch('http://localhost:9000/voice-level', {
	  method: 'POST',
	  body: formData,
	});

	if (response.ok) {
	  let amp=(await response.json()).normalized_amplitude;
	  console.log("amplitude",amp);
	  godotBridge.test({message:"db_level", value:amp});

	} else {
	  console.error('Error sending audio:', response.status, response.statusText);
	}
  } catch (error) {
	console.error('Error sending audio:', error);
  }
}

// Start recording and send audio chunks
async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);

  const audioChunks = [];

  mediaRecorder.addEventListener('dataavailable', (event) => {
	if (event.data.size > 0) {
	  audioChunks.push(event.data);
	}
  });

  mediaRecorder.addEventListener('stop', async () => {
	await sendAudioChunks(audioChunks);
  });

  mediaRecorder.start();

  setTimeout(() => {
	mediaRecorder.stop();
  }, 5000); // Recording for 5 seconds, adjust as needed
}*/

/*function startPeriodic() {
  setInterval(startRecording, 1000);
}*/

let mediaRecorder;
let audioChunks = [];

function updateDBFSLevel(level) {
  const dbfsBar = document.querySelector('.dbfs-bar');
  dbfsBar.style.width = level + '%'; // Set width based on the dBFS level
}

async function sendAudioChunks() {
  const formData = new FormData();
  formData.append('audio', new Blob(audioChunks, { type: 'audio/webm' }));

  try {
	//const response = await fetch('https://wegame.voiceover.market/clap', {
	const response = await fetch('http://localhost:9000/clap', {
	  method: 'POST',
	  body: formData,
	});

	if (response.ok) {
	  let res = await response.json();
	  godotBridge.test({message:"db_level", value:res.score});
	} else {
	  console.error('Error sending audio:', response.status, response.statusText);

	}
  } catch (error) {
	console.error('Error sending audio:', error);
  }
}

function startRecording(duration = 1000) {
  navigator.mediaDevices.getUserMedia({ audio: true })
	.then(stream => {
	  mediaRecorder = new MediaRecorder(stream);

	  mediaRecorder.addEventListener('dataavailable', (event) => {
		if (event.data.size > 0) {
		  audioChunks.push(event.data);
		}
	  });

	  mediaRecorder.addEventListener('stop', () => {
		sendAudioChunks();
		audioChunks = []; // Clear the chunks after sending
	  });

	  // Record for the specified duration and then stop
	  setTimeout(() => {
		mediaRecorder.stop();
	  }, duration);

	  mediaRecorder.start();

	  // Continuously monitor audio input and update the peek value
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
		const normalizedLevel = (maxLevel / 255) * 100; // Normalize to percentage
		//updateDBFSLevel(normalizedLevel);
		godotBridge.test({message:"db_level_update", value:normalizedLevel});
		requestAnimationFrame(updateDBFS);
	  };

	  updateDBFS();
	})
	.catch(error => {
	  console.error('Error accessing microphone:', error);
	});
}

/*document.addEventListener('DOMContentLoaded', () => {
  // Automatically start recording when the page loads
  startRecording(Infinity); // Record indefinitely

  const startRecordingButton = document.getElementById('startRecordingButton');
  if (startRecordingButton) {
	startRecordingButton.addEventListener('click', () => {
	  // Start recording for 1 second when the button is clicked
	  startRecording(1000); // 1000 milliseconds (1 second)
	});
  }
});*/
