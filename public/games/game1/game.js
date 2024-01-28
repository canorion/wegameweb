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

// Function to send audio chunks to the FastAPI endpoint
async function sendAudioChunks(audioChunks) {
  const formData = new FormData();
  formData.append('audio', new Blob(audioChunks, { type: 'audio/webm' }));

  try {
	const response = await fetch('https://wegame.voiceover.market/voice-level', {
	  method: 'POST',
	  body: formData,
	});

	if (response.ok) {
	  let amp=(await response.json()).normalized_amplitude;
	  console.log("amplitude",amp);
	  //updateDBFSLevel(amp);

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
}

function startPeriodic() {
  setInterval(startRecording, 1000);
}
