let lastTime = 0;
const gameTimeInSeconds = 45;
let jumpArray = [];
let gameIsOn = true;
let timeLine = 0;
let playerJumped = false;
let timeLineContent = '<div class="gameContainer">{{runner}}<i class="fa fa-minus ground {{textClass}}"></i></div>';

const btnJump = $('#jumpBtn');
const messageDiv = document.getElementById('messageDiv');
const timeLineContainer = document.getElementById('timeLineContainer');

const showMessage = (message, type) => {
  messageDiv.style.display = 'block';
  messageDiv.className = `alert alert-${type}`;
  messageDiv.innerText = message;
};

btnJump.on('click', function () {
  if (gameIsOn) {
    
    const jumpBtn = document.getElementById('jumpBtn');
    jumpBtn.style.backgroundImage = "url('images/jumpBtnPressed.png')";
    
    // showMessage("Jumped!", "success");
    
     setTimeout(() => {
      jumpBtn.style.backgroundImage = "url('images/jumpBtn.png')";
    }, 1000);
    
    playerJumped = true;
    btnJump.prop('disabled', true);
  }
});

const updateTimeLine = () => {
  var second = Math.floor(timeLine);
  var content = timeLineContent;
  var timeLineContentArray = [];
  
  let imageIndex = second % 6 + 1;

  for (var i = second; i < 9 + second; i++) { 
    
    if(i == second)
    {
      content = timeLineContent;
    
      content = content.replace('{{runner}}', '<div class="player"></div> ');
      content = content.replace('{{textClass}}', "text-success");
    
      timeLineContentArray.push(content);
    }
    
    content = timeLineContent;
    
    content = content.replace('{{runner}}', '')
    
    if(jumpArray.includes(i)) 
    {
      content = content.replace('{{textClass}}', "text-danger");
    }
    else 
    {  
      content = content.replace('{{textClass}}', "text-success");
    }
    
    timeLineContentArray.push(content);
  }
  
  timeLineContainer.innerHTML = timeLineContentArray.join('');
  
  $(".player").css("background-image", "url('images/" + imageIndex + ".png')");

};

const finishTheGame = (win) => {
  gameIsOn = false;
  if (!win) {
    showMessage("You Lose!", "danger");
  } else {
    showMessage("You Win!", "success");
  }
  btnJump.prop('disabled', true);
};

const gameLoop = (timestamp) => {
  if (!lastTime) lastTime = timestamp;
  const deltaTime = (timestamp - lastTime) / 750;
  lastTime = timestamp;

  if (!gameIsOn) return;

  timeLine += deltaTime;
  updateTimeLine();
 
  if (timeLine >= gameTimeInSeconds) {
    finishTheGame(true);
  } else {
    
    for (let jumpTime of jumpArray) {
      if (timeLine >= jumpTime && timeLine - deltaTime < jumpTime) {
        //showMessage("Time to JUMP!", "warning");
        
        setTimeout(() => {
          if (gameIsOn && !playerJumped) {
            showMessage("You Lose!", "danger");
            
            var nextObject = $(".player").next();
            nextObject.removeClass("text-success").addClass("text-danger");
            
            finishTheGame(false);
          }
          
          playerJumped = false;
          btnJump.prop('disabled', false);
        }, 1000);
        
        break;
      }
    }
  }
  
  if(playerJumped) {
    $(".player").css("top", "0px");
    
    var second = Math.floor(timeLine);
    
    if(jumpArray.includes(second)) 
    {
      $('.gameContainer i').first().hide();
    }
    
    setTimeout(() => {
      $(".player").css("top", "15px");
      playerJumped = false;
      btnJump.prop('disabled', false);
    }, 1000);
  
  }
  
  requestAnimationFrame(gameLoop);
};

var imagesToPreload = [
  'images/1.png',
  'images/2.png',
  'images/3.png',
  'images/4.png',
  'images/5.png',
  'images/6.png',
];

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

//requestAnimationFrame(gameLoop);

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