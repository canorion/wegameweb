document.querySelectorAll(".dropdown-toggle").forEach((item) => {
    item.addEventListener("click", (event) => {
        if (event.target.classList.contains("dropdown-toggle")) {
            event.target.classList.toggle("toggle-change");
        } else if (
            event.target.parentElement.classList.contains("dropdown-toggle")
        ) {
            event.target.parentElement.classList.toggle("toggle-change");
        }
    });
});

$(function () {
    //twitter bootstrap script
    $(".sign-in").click(function () {
        $.ajax({
            type: "POST",
            url: "PastSurgicalCustomItem",
            data: $('form.form-horizontal').serialize(),
            success: function (msg) {
                alert(msg);
            },
            error: function () {
                alert("failure");
            }
        });
    });
});