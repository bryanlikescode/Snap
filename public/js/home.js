$(function(){

        //retrieve the token from local storage
        var token = window.localStorage.getItem("token");
        var passingToken = { u: token };
        // load the image information from the database
        $.get('/api/images/images', passingToken, (data)=>{
            var html = '<div class="card border-success mt-3">\n ' +
                        '<h2 class="card-header">Images</h2>\n'
                        '<div class="card-body">\n';
            // Create a card for all recent images
            for (var i=0; i<data.length; i++) {
                html += '<img class="thumbImg" src="images/thumbs/' + data[i].filename + '"> \n';
            }
            html += '</div>\n</div>'
            $('#imageArea').html(html);
        });   
    
        // checks for the logout button to be clicked
        $("#buttonLogout").click(function() {
            redirectLogout();
        })

        // uses token to redirect you to update page
        function redirectUpdate() {
            // update.html is pageNo 389023
            var pageNo = "389023"
            // retrieve the token from local storage
            var token = window.localStorage.getItem("token");
            //set token to x auth header to pass page API 
            $.ajax({
                url: "/api/pages?pageid=" + pageNo, 
                type: "GET",
                headers: { "X-Auth": token },
                dataType: "html",
            }).done((data)=>{
                data = data.trim();         // Remove whitespace
                $("#main").html(data);      // Replace current page with data from server
            })
         }
    
        // uses token to redirect you to update page
        function redirectLogout() {
            // index.html is pageNo 000000
            var pageNo = "000000"
            // retrieve the token from local storage
            var token = window.localStorage.getItem("token");
            //set token to x auth header to pass page API 
            $.ajax({
                url: "/api/pages?pageid=" + pageNo, 
                type: "GET",
                headers: { "X-Auth": token },
                dataType: "html",
            }).done((data)=>{
                data = data.trim();         // Remove whitespace
                $("#main").html(data);      // Replace current page with data from server
                window.localStorage.removeItem("token"); // Remove the token from local storage (user is not authorized any longer)
            })
         }
    
    
        /// update.js 

        var token = window.localStorage.getItem("token");    
        $("#myForm").submit( function(event) { 
            event.preventDefault(); 
            var actionURL = event.currentTarget.action;     
            var formData = new FormData(this);
            $.ajax({
                url: actionURL,
                type: 'post',
                headers: {"X-Auth": token },
                data: formData,
                cache:false,
                contentType: false,
                processData: false,
                success: function () {
                    redirectHome();
                    $('.modal-backdrop').remove();
                }
            });    
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
    
});
    
    
    