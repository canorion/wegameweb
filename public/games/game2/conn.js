$(function () {
    $("#playerForm").on("submit", function (event) {
        event.preventDefault();
        
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/api/hotdog/game",
            dataType: "json",
            encode: true
        })
        .done(function (data) {
            console.log(data);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error("Err: " + textStatus, errorThrown);
        });
    });
});


function InsertPlayer() {
    var formData = {
        block: $("#block").val(),
        seat: $("#seat").val()
    };

    $.ajax({
        type: "POST",
        url: "http://localhost:3000/api/hotdog/player",
        data: formData,
        dataType: "json",
        encode: true
    })
    .done(function (data) {
        console.log(data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Err: " + textStatus, errorThrown);
    });
}

function InsertHotDogGame()
{   
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/hotdog/game",
        dataType: "json",
        encode: true
    })
    .done(function (data) {
        console.log(data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Err: " + textStatus, errorThrown);
    });
}