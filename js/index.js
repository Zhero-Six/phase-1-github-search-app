// js/index.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    const mainDiv = document.getElementById('main');
    
    // Bonus: Add search type toggle
    let searchType = 'users'; // Default to user search
    
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Switch to Repo Search';
    toggleButton.style.marginLeft = '10px';
    form.appendChild(toggleButton);

    // API endpoints and headers
    const baseUrl = 'https://api.github.com';
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    };

    // Toggle search type
    toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        searchType = searchType === 'users' ? 'repos' : 'users';
        toggleButton.textContent = `Switch to ${searchType === 'users' ? 'Repo' : 'User'} Search`;
        userList.innerHTML = '';
        reposList.innerHTML = '';
    });

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (!searchTerm) return;

        userList.innerHTML = '';
        reposList.innerHTML = '';

        if (searchType === 'users') {
            searchUsers(searchTerm);
        } else {
            searchRepos(searchTerm);
        }
    });

    // Search for users
    function searchUsers(query) {
        fetch(`${baseUrl}/search/users?q=${query}`, { headers })
            .then(response => response.json())
            .then(data => {
                if (data.items) {
                    data.items.forEach(user => renderUser(user));
                }
            })
            .catch(error => console.error('Error searching users:', error));
    }

    // Render user to DOM
    function renderUser(user) {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <img src="${user.avatar_url}" alt="${user.login}" style="width: 50px; height: 50px;">
                <a href="${user.html_url}" target="_blank">${user.login}</a>
            </div>
        `;
        
        // Add click event to show repos
        li.addEventListener('click', () => fetchUserRepos(user.login));
        
        userList.appendChild(li);
    }

    // Fetch user's repositories
    function fetchUserRepos(username) {
        reposList.innerHTML = '';
        fetch(`${baseUrl}/users/${username}/repos`, { headers })
            .then(response => response.json())
            .then(repos => {
                repos.forEach(repo => renderRepo(repo));
            })
            .catch(error => console.error('Error fetching repos:', error));
    }

    // Render repository to DOM
    function renderRepo(repo) {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <p>${repo.description || 'No description'}</p>
        `;
        reposList.appendChild(li);
    }

    // Bonus: Search for repositories
    function searchRepos(query) {
        fetch(`${baseUrl}/search/repositories?q=${query}`, { headers })
            .then(response => response.json())
            .then(data => {
                if (data.items) {
                    data.items.forEach(repo => renderRepo(repo));
                }
            })
            .catch(error => console.error('Error searching repos:', error));
    }
});