const btnJump = $('#jumpBtn');
const messageDiv = document.getElementById('messageDiv');

const showMessage = (message, type) => {
  messageDiv.style.display = 'block';
  messageDiv.className = `alert alert-${type}`;
  messageDiv.innerText = message;
};

btnJump.on('click', function () {
    const jumpBtn = document.getElementById('jumpBtn');
    jumpBtn.style.backgroundImage = "url('images/jumpBtnPressed.png')";
    btnJump.prop('disabled', true);
    
    var currentTime = new Date();
    var timeDifference = (currentTime - gameStartTime) / 1000;
    timeArray.push(timeDifference);
    
    setTimeout(() => {
      jumpBtn.style.backgroundImage = "url('images/jumpBtn.png')";
      btnJump.prop('disabled', false);
    }, 1000);
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