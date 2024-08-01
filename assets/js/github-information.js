function userInformationHTML(user) {
    return `
        <div class="row pt-3 mt-2">
            <div class="col-12 col-xl-8 text-center text-md-start pt-2">
                <a href="${user.html_url}" target="_blank">
                    <img src="${user.avatar_url}" class="github-avatar" alt="${user.login}" />
                </a>
                <h2 class="account-name text-center text-md-start mt-3">${user.name}</h2>
                <h3 class="small-name text-center text-md-start mt-1">
                    (@<a class="small-name" href="${user.html_url}" target="_blank">${user.login}</a>)
                </h3>
            </div>
            <div class="col-12 col-xl-4 text-center text-md-start pt-3 pt-xl-5 mt-xl-5">
                <div class="col text-center text-md-start github-info">
                    <p class="p-0 m-0">Followers: ${user.followers}</p>
                    <p class="p-0 m-0">Following ${user.following}</p>
                    <p class="p-0 m-0">Repos: ${user.public_repos}</p>
                </div>
            </div>
        </div>`;
}

function repoInformationHTML(repos) {
    if (repos.length == 0) {
        return `<div class="clearfix repo-list">No repos!</div>`;
    }

    var listItemsHTML = repos.map(function(repo) {
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`;
    });

    return `
            <h4 class="mt-4 github-repo text-center text-md-start">
                <strong>Repo List:</strong>
            </h4>
            <div class="repo-list mt-4">
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`;
}

function fetchGitHubInformation(event) {
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");

    var username = "A-Croshaw";
    if (!username) {
        $("#gh-user-data").html();
        return;
    }

    $("#gh-user-data").html(
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);

    $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
        function(firstResponse, secondResponse) {
            var userData = firstResponse[0];
            var repoData = secondResponse[0];
            $("#gh-user-data").html(userInformationHTML(userData));
            $("#gh-repo-data").html(repoInformationHTML(repoData));
        },
        function(errorResponse) {
            if (errorResponse.status === 404) {
                $("#gh-user-data").html(
                    `<h2>No info found for user ${username}</h2>`);
            } else if (errorResponse.status === 403) {
                var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset') * 1000);
                $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);
            } else {
                console.log(errorResponse);
                $("#gh-user-data").html(
                    `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        });
}

$(document).ready(fetchGitHubInformation);