var repoNameEl = document.querySelector("#repo-name");
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");

var getRepoName = function() {
    // queryString will be "?repo={user}/{repo}"
    var queryString = document.location.search;
    // split search data at = ({"?repo", "{user}/{repo}"), set repoName to second element of array
    var repoName = queryString.split("=")[1];
    
    // if valid, display on page and pass repoName into getRepoIssues()
    if (repoName) {
        // display name on page
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    } else {
        // if no repo given, redirect to homepage
        document.location.replace("./index.html");
    }
};

var getRepoIssues = function(repo) {
    // format github api url, ?direction=asc for sorting
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    // make GET request
    fetch(apiUrl).then(function(response){
        // if request successful
        if (response.ok) {
            response.json().then(function(data){
                    // pass response data to dom function
                    displayIssues(data);

                    // check if api has paginated issues, if true call displayWarning with repo as parameter
                    if (response.headers.get("Link")) {
                        displayWarning(repo);
                    }
                });
        } else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    });
};

var displayIssues = function(issues) {
    // if repo has no open issues
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    // loop through issues
    for (var i = 0; i < issues.length; i++) {
        // create link element to take user to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");
        
        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        
        // append to container
        issueEl.appendChild(titleEl);
        
        // create a type element
        var typeEl = document.createElement("span");
        
        // check if issue is an actual issue or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        
        // append to container
        issueEl.appendChild(typeEl);
        
        // append to the dom
        issueContainerEl.appendChild(issueEl);    
    }

};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    // create link element
    var linkEl = document.createElement("a");
    linkEl.textContent = "GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();
