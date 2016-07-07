$(document).ready(function() {
    $('#urlform').submit( function() {
        event.preventDefault();
        $("#url-test").removeClass("alert-danger");
        $("#url-test").removeClass("alert-success");
        $( "#url-test" ).text("");
        $.ajax({
            method:'POST',
            url: '/api',
            data: JSON.stringify({ url: $('#url').val() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(data) {
            console.log(data);
            var message = "";
            if (data.hasOwnProperty('error')){
                $("#url-test").addClass("alert-danger");
                message = data.error;
                console.log(data.error);
            } else {
                if (data.hasOwnProperty('match')){
                    message = "Danger! Url " + data.url + " Is a " + data.match + " Website. We recommend not to trust it";
                    $("#url-test").addClass("alert-danger");

                } else {
                    message = "Url " + data.url + " Seems to be a cool url, feel free to visit it";
                    $("#url-test").addClass("alert-success");
                }
            }
            $( "#url-test" ).text(message);
        });
    });
});
