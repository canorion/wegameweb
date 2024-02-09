var apiUrl;

if (window.location.hostname === 'localhost') {
  apiUrl = 'http://localhost:3001';
} else {
  apiUrl = 'https://stadiumgames.azurewebsites.net';
}

var playerId = '';
var gameId = '';
var isGameStarted = false;
var gameStartTime = new Date();
var timeArray = [];

$(function () {
    $("#playerForm").on("submit", function (event) {
        event.preventDefault();
        
        var isValid = true; 
        
        var formData = $(this).serializeArray();
        
        formData.forEach(function(item) {
            if (!item.value) { 
                 isValid = false;
            }
        });
        
        if(!isValid) {
            alert("Please fill the form!");
            return false;
        }
        
        if(selectedTeam === undefined || selectedTeam === '') 
        { 
            alert("Please select your side!");
            return false;
        }
        
        $.ajax({
            type: "GET",
            url: apiUrl + "/api/hotdog/game",
            dataType: "json",
            encode: true
        })
        .done(function (response) {
            
            gameStartTime = new Date();
            
            if(response.data.length === 0) {
                //console.log("Game inserted successfully");
                InsertHotDogGame(); 
            } 
            else
            {            
                gameId = response.data[0]._id
                InsertPlayer(gameId);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error("Err: " + textStatus, errorThrown);
        });
    });
});

function InsertPlayer(gameId) {
    var formData = {
        block: $("#block").val(),
        seat: $("#seat").val(),
        hotdoggame: gameId, 
        side: selectedTeam 
    };

    $.ajax({
        type: "POST",
        url: apiUrl + "/api/hotdog/player",
        data: formData,
        dataType: "json",
        encode: true
    })
    .done(function (response) {
        console.log("Created Player Id: " + response.data.id);
        playerId = response.data.id;
        $(".login-container").fadeOut(0, function () { 
            $(".btnContainer").fadeIn(0);  
        });
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Err: " + textStatus, errorThrown);
    });
}

function InsertHotDogGame()
{   
    $.ajax({
        type: "POST",
        url: apiUrl + "/api/hotdog/game",
        dataType: "json",
        encode: true
    })
    .done(function (response) {
        console.log("Created Game Id: " + response.data.id);  
        gameId = response.data.id;
        InsertPlayer(response.data.id);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Err: " + textStatus, errorThrown);
    });
}

function checkWinner() {
    
    $.ajax({
        type: "GET",
        url: apiUrl + "/api/hotdog/checkwinner/" + gameId,
        dataType: "json",
        encode: true
    })
    .done(function (response) {
        console.log(response);
        
        $(".btnContainer").fadeOut(0); 
        
        showMessage(response.winner, "success");
        
        if(response.playerId === playerId) {
            //showMessage("You Win!", "success");
            $("#winImg").fadeIn(1000);  
        }
        else
        {
            //showMessage("You Lose!", "danger");
            $("#loseImg").fadeIn(1000);  
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Err: " + textStatus, errorThrown);
    });
}

function insertPlayerTimeData() {
    var formData = {
        playerId: playerId,
        timeData: timeArray.join(',')
    };
    
    $.ajax({
        type: "POST",
        url: apiUrl + "/api/hotdog/playertimedata",
        data: formData,
        dataType: "json",
        encode: true
    })
  .done(function (response) {
    
    setTimeout(() => {
        checkWinner();  
    }, 5000);
    
  });
}

var isGameStartedCheckURL = apiUrl + "/api/hotdog/game";

var intervalID = setInterval(function() {
    $.ajax({
        url: isGameStartedCheckURL + "/" + gameId,
        type: 'GET',
        success: function(response) {
            
            if(isGameStarted)
            {
                if(response.data.length > 0 && response.data[0].isFinished)
                {
                    console.log("Finished");
                    insertPlayerTimeData();
                    clearInterval(intervalID);
                }
            }
            else 
            {
                if(response.data.length > 0 && response.data[0].isStarted)
                {
                    //console.log(response);
                    
                    isGameStarted = true;
                    
                    gameStartTime = new Date();
                  
                }
            }
        },
        error: function(xhr, status, error) {
            clearInterval(intervalID);
            console.error('Error:', status, error);
        }
    });
}, 1000);
