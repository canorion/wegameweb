var isGameStarted = false;

new Image().src = "images/jumpBtnPressed.png";
new Image().src = "images/jumpBtn.png";

const btnJump = $('#jumpBtn');
const messageDiv = document.getElementById('messageDiv');

const showMessage = (message, type) => {
  messageDiv.style.display = 'block';
  //messageDiv.className = `alert alert-${type}`;
  messageDiv.innerText = "WINNER IS " + message;
};

(function () {
  // Check if the browser supports web audio. Safari wants a prefix.
  if ("AudioContext" in window || "webkitAudioContext" in window) {
    //////////////////////////////////////////////////
    // Here's the part for just playing an audio file.
    //////////////////////////////////////////////////
    var ButtonPlay = function ButtonPlay(audioBuffer) {
      var source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      source.start();
    };

    var soundUrl = "click.mp3";
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext(); // Make it crossbrowser
    var gainNode = context.createGain();
    gainNode.gain.value = 1; // set volume to 100%
    var eventButton = document.getElementById("jumpBtn");
    var yodelBuffer = void 0;

    // The Promise-based syntax for BaseAudioContext.decodeAudioData() is not supported in Safari(Webkit).
    window
      .fetch(soundUrl)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) =>
        context.decodeAudioData(
          arrayBuffer,
          (audioBuffer) => {
            yodelBuffer = audioBuffer;
          },
          (error) => console.error(error)
        )
      );
    
      eventButton.addEventListener("click", (event) => {
        return ButtonPlay(yodelBuffer);
      })
    //////////////////////////////////////////////////
    // Here's the part for unlocking the audio context, probably for iOS only
    //////////////////////////////////////////////////

    function unlock() {
      console.log("unlocking");
      // create empty buffer and play it
      var buffer = context.createBuffer(1, 1, 22050);
      var source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);

      // play the file. noteOn is the older version of start()
      source.start ? source.start(0) : source.noteOn(0);

      // by checking the play state after some time, we know if we're really unlocked
    }
    // Try to unlock, so the unmute is hidden when not necessary (in most browsers).
    unlock();
  }
})();


btnJump.on('click', function () {
  
  const btnJump = $('#jumpBtn');
  btnJump.css('backgroundImage', "url('images/jumpBtnPressed.png')");
  btnJump.prop('disabled', true);

  setTimeout(() => {
    btnJump.css('backgroundImage', "url('images/jumpBtn.png')");
    btnJump.prop('disabled', false);
  }, 1000);
  
  if ("vibrate" in navigator) {
    navigator.vibrate(200);
  }
  
  if(isGameStarted) {
    var currentTime = new Date();
    var timeDifference = (currentTime - gameStartTime) / 1000;
    timeArray.push(timeDifference);
  }
});

let selectedTeam = '';

function selectTeam(team) {
    const homeButton = document.getElementById('homeButton');
    const awayButton = document.getElementById('awayButton');

    homeButton.style.backgroundImage = "url('images/homeBtn.png')";
    awayButton.style.backgroundImage = "url('images/awayBtn.png')";

    if (team === 'home') {
        homeButton.style.backgroundImage = "url('images/homeBtnPressed.png')";
        selectedTeam = 'home';
    } else if (team === 'away') {
        awayButton.style.backgroundImage = "url('images/awayBtnPressed.png')";
        selectedTeam = 'away';
    }
}