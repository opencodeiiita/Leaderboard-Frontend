const confettiCanvas = document.querySelector('.tsparticles-canvas-el');
const header = document.querySelector("header");
var toggleButton = document.getElementById("toggle");
$(document).ready(() => {
    let isDarkMode = localStorage.getItem('dark');
    if (isDarkMode === null)
        return localStorage.setItem('dark', 0);
    if (isDarkMode == 1) {
        console.log('came here2');
        toggleButton.classList.add("active");
        confettiCanvas.style.backgroundColor = "#232323";
        header.style.color = "white";
    }
});
toggleButton.onclick = function () {
    toggleButton.classList.toggle("active");
    let isDarkMode = localStorage.getItem('dark');
    if (isDarkMode == 0) {
        confettiCanvas.style.backgroundColor = "#232323";
        header.style.color = "white";
        isDarkMode = 1;
    }
    else {
        confettiCanvas.style.backgroundColor = "#E6F4F2";
        header.style.color = "black";
        isDarkMode = 0;
    }
    localStorage.setItem('dark', isDarkMode);
};
var page = 1;
var rank = 0;
var lastScore = -1;
var hasNext = true;
let isFetching = true;
const $end = document.querySelector('#end');
const $loader = document.querySelector('.loader');
async function getData() {
    $loader.classList.remove('hide');
    let res = await fetch(`https://opencodeiiita.herokuapp.com/get-all-data/?page=${page}`);
    let data = await res.json();
    $loader.classList.add('hide');
    return data;
}
window.addEventListener('scroll', () => {
    if (isFetching)
        return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        console.log('reached end');
        page++;
        isFetching = true;
        if (hasNext) {
            previousFetched = Date.now();
            getData().then(data => {
                isFetching = true;
                hasNext = data.has_next;
                addToTable(data.data);
                isFetching = false;
            });
        }
        else {
            $end.style.display = "block";
            isFetching = true;
        }
    }
});
getData().then(data => {
    isFetching = true;
    console.log(data);
    hasNext = data.has_next;
    addToTable(data.data);
    isFetching = false;
});
function addToTable(arr) {
    var i;
    for (i = 0; i < arr.length; i++) {
        name = arr[i].username;
        points = arr[i].totalPoints;
        if (lastScore !== points) {
            lastScore = points;
            rank++;
        }
        let rankClass = "";
        switch (rank) {
            case 1:
                rankClass = " first";
                break;
            case 2:
                rankClass = " second";
                break;
            case 3:
                rankClass = " third";
                break;

            default:
                rankClass = "";
        }

        const markup = `
       
        <li class="user${rankClass} zoom">
        <div class="rank">
        ${rank}
        </div>
        <div class="profile">
        <a target="_blank" href="https://github.com/${name}" class="githubLink">
                <img src="https://avatars.githubusercontent.com/${name}?size=200" alt="profile"> 
                </a>
                </div>
                <div class="username">
                <a target="_blank" href="https://github.com/${name}" class="githubLink">
                ${name}
                </a>
                </div>
            <div class="points">
                ${points} pts.
            </div>
        </li>    `;
        $('.rank-list').append(markup);
    }
}