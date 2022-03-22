var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make fetch request to the url
    fetch(apiUrl).then(function(response) {
        console.log(response);
        response.json().then(function(data) {
            console.log(data);
        });
    });
};

// call function, use user name in quotes as a parameter
// ex: getUserRepos("blindsweatyhansolo"); will return my own!
getUserRepos();