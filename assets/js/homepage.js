var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

var formSubmitHandler = function(event) {
    // stops browser from performing default action the event wants it to do
    // in a form as such prevents browser from sending the input data to a URL
    event.preventDefault();

    // get value from input
    var username = nameInputEl.value.trim();

    if (username) {
        // on valid input passes as parameter for getUserRepos()
        getUserRepos(username);
        // clear old content
        repoContainerEl.textContent = "";
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

var buttonClickHandler = function(event) {
    // set language to targeted buttons data-language attribute
    var language = event.target.getAttribute("data-language");
    
    // pass as parameter for getFeaturedRepos
    if (language) {
        getFeaturedRepos(language);

        // clear old content
        repoContainerEl.textContent = "";
    }
};

var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make fetch request to the url
    fetch(apiUrl)
        .then(function(response) {
            // if 200 (ok), send data to displayRepos()
            // if false (404 - invalid search term/user not found) alert user
        if (response.ok) {
            // console.log(response);
            response.json().then(function(data) {
                // console.log(data);
                // send data to displayRepos()
                displayRepos(data, user);
            });
        } else {
            alert("Error: GitHub User Not Found");
            // alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        // .catch() handles network errors (network issues on API side), gets chained to the end of the .then() method 
        alert("Unable to connect to GitHub");
    });
};

var getFeaturedRepos = function(language) {
    // format github api url to search repos with language parameter from button
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    // GET request to url
    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
        } else {
            alert("Error: GitHub User Not Found");
            // alert("Error: " + response.statusText);
        }
    });
};

var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos (user exists but has no repos)
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }    

    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create container/link for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

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

// event listeners for form and button container
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);
