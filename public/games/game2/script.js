new Image().src = "images/jumpBtnPressed.png";
new Image().src = "images/jumpBtn.png";


const btnJump = $('#jumpBtn');
const messageDiv = document.getElementById('messageDiv');

const showMessage = (message, type) => {
  messageDiv.style.display = 'block';
  //messageDiv.className = `alert alert-${type}`;
  messageDiv.innerText = "WINNER IS " + message;
};

btnJump.on('click', function () {
    
  const btnJump = $('#jumpBtn');
  btnJump.css('backgroundImage', "url('images/jumpBtnPressed.png')");
  btnJump.prop('disabled', true);

  setTimeout(() => {
    btnJump.css('backgroundImage', "url('images/jumpBtn.png')");
    btnJump.prop('disabled', false);
  }, 1000);

  var audio = document.getElementById("myAudio");
  audio.currentTime = 0;
  audio.play();
  
  if ("vibrate" in navigator) {
    navigator.vibrate(200);
  }
  
  
  var currentTime = new Date();
  var timeDifference = (currentTime - gameStartTime) / 1000;
  timeArray.push(timeDifference);
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