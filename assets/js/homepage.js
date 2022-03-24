var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function(event) {
    // stops browser from performing default action the event wants it to do
    // in a form as such prevents browser from sending the input data to a URL
    event.preventDefault();

    // get value from input
    var username = nameInputEl.value.trim();

    if (username) {
        // on valid input passes as parameter for getUserRepos(), clears form value
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username to search");
    }
    // console.log(event);
};

var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make fetch request to the url
    fetch(apiUrl)
        .then(function(response) {
            // if 200 (ok), send data to displayRepos(), if false (404 - invalid search term/user not found) alert user
        if (response.ok) {
            response.json().then(function(data) {
                // send data to displayRepos()
                displayRepos(data, user);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
    })
    .catch(function(error) {
        // .catch() handles network errors (network issues on API side), gets chained to the end of the .then() method 
        alert("Unable to connect to GitHub");
    });
};

var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos (user exists but has no repos)
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // create span element to hold repo name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not, x icon if issues present / check icon if no issues
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";   
        } else {
            statusEl.innerHTML =
                "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to dom
        repoContainerEl.appendChild(repoEl);
    }
};


userFormEl.addEventListener("submit", formSubmitHandler);

// call function, use user name in quotes as a parameter
// ex: getUserRepos("blindsweatyhansolo"); will return my own!
// getUserRepos();