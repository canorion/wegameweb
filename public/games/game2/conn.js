var apiUrl;

if (window.location.hostname === 'localhost') {
  apiUrl = 'http://localhost:3000';
} else {
  apiUrl = 'https://stadiumgames.azurewebsites.net:8081';
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
            var activeGame = response.data.length;
            
            if(activeGame === 0) {
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
        hotdoggame: gameId
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
        $("#playerForm").fadeOut(1000, function () { 
            $("#gameContainer").fadeIn(2000);  
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

function startGame() {
    
    let randomArray = createRandomArray(5, 44, 3);
    
    jumpArray.push(...randomArray);
    
    jumpArray.sort(function(a, b) {
        return a - b;
    });
    
    var formData = {
        gameId: gameId,
        timeData: randomArray.join(",")
    };
    
    $.ajax({
        type: "POST",
        url: apiUrl + "/api/hotdog/startgame",
        data: formData,
        dataType: "json",
        encode: true
    })
    .done(function (response) {
        showMessage("Game Started!", "success");
        requestAnimationFrame(gameLoop);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Err: " + textStatus, errorThrown);
    });
}

function createRandomArray(min, max, minDifference) {
    let possibleValues = [];
    for (let i = min; i <= max; i++) {
        possibleValues.push(i);
    }

    let result = [];
    while (possibleValues.length > 0 && (max - min) / minDifference >= result.length) {
        // Rastgele bir indeks seç
        let randomIndex = Math.floor(Math.random() * possibleValues.length);
        let selectedValue = possibleValues[randomIndex];

        // Seçilen değeri sonuç dizisine ekle
        result.push(selectedValue);

        // Seçilen değere göre, mümkün olan değerler listesinden uygun olmayanları çıkar
        possibleValues = possibleValues.filter(val => Math.abs(val - selectedValue) >= minDifference);
    }

    return result;
}

