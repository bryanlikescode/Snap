window.onload = function(){
    
    // posts the username and password through the users /auth api
function login (username, password) {
    // turning data into json
    var requestData = { username: username, password: password };
    // post json
    $.post("api/auth", requestData, function(data) {
        // if token is returned store it in local storage and run displaystatus
        if (data.token) {
            var token = data.token;
            window.localStorage.setItem("token", token);
            redirectHome();
        }
        else {
            res.send("token not found");
        }
    });
}

$("#login").submit( function(event) {
    //prevent from redirecting elsewhere
    event.preventDefault();
    //take the values in boxes and pass them to the login function
    login( $("#username").val(), $("#password").val());
});
    
// uses token to redirect you to home page
function redirectHome() {
    // home.html is pageNo 877740
    var pageNo = "877740";
    // Retrieve the token from local storage
    var token = window.localStorage.getItem("token");
    //set token to x auth header to pass page API 
    $.ajax({
        url: "/api/pages?pageid=" + pageNo, 
        type: "GET",
        headers: { "X-Auth": token },
        dataType: "html",
    }).fail((jqXHR) => {
        if (jqXHR.status != 401 || jqXHR.status != 404) {
            alert("Server Error. Try again later.");
        }
    }).done((data)=>{
        data = data.trim();         // Remove whitespace
        $("#main").html(data);      // Replace current page with data from server
    });
};
    
}