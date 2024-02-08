var apiUrl;

if (window.location.hostname === 'localhost') {
  apiUrl = 'http://localhost:3001';
} else {
  apiUrl = 'https://stadiumgames.azurewebsites.net';
}

var playerId = '';
var gameId = '';

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
            
            if(response.data.length === 0) {
                console.log("Game inserted successfully");
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
        playerId = response.data._id;
        $("#playerForm").fadeOut(0, function () { 
            $("#gameContainer").fadeIn(0);  
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

var isGameStartedCheckURL = apiUrl + "/api/hotdog/game";

var intervalID = setInterval(function() {
    $.ajax({
        url: isGameStartedCheckURL + "/" + gameId,
        type: 'GET',
        success: function(response) {
            if(response.data.length > 0 && response.data[0].isStarted)
            {
                console.log(response);
                
                clearInterval(intervalID);
            
                var timeData = response.data[0].timeData.split(',').map(item => parseInt(item, 10));
               
                jumpArray.push(...timeData);
                
                jumpArray.sort(function(a, b) {
                    return a - b;
                });
                
                setTimeout(() => {
                    requestAnimationFrame(gameLoop);
                  }, 1000);
                
                showMessage("Game Started!", "success");
            }
        },
        error: function(xhr, status, error) {
            console.error('Hata:', status, error);
        }
    });
}, 1000);
