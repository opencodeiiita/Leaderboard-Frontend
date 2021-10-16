const body = document.querySelector('body');
const header = document.querySelector("header");
var toggleButton = document.getElementById("toggle");
var geekHaven_logo=document.getElementById("geekhaven_logo");

$(document).ready(() => {
    let isDarkMode = localStorage.getItem('dark');
    if (isDarkMode === null)
        {   geekHaven_logo.src="./Assets/geekhaven_lightmode1.png";
            return localStorage.setItem('dark', 0);
    }
    if (isDarkMode == 1) {
        // console.log('came here2');
        toggleButton.classList.add("active");
        body.style.background = "linear-gradient(315deg, #485461 0%, #28313b 74%)";
        header.style.color = "white";
        geekHaven_logo.src="./Assets/geekhaven_darkmode.png";
    }
    else if(isDarkMode==0)
        geekHaven_logo.src="./Assets/geekhaven_lightmode.png";
    setTimeout(() => {
        const confetti = document.querySelector('#tsparticles');
        confetti.remove();
    }, 5000);
});
toggleButton.onclick = function () {
    toggleButton.classList.toggle("active");
    let isDarkMode = localStorage.getItem('dark');
    if (isDarkMode == 0) {
        body.style.background = "linear-gradient(315deg, #485461 0%, #28313b 74%)";
        header.style.color = "white";
        geekHaven_logo.src="./Assets/geekhaven_darkmode.png";
        isDarkMode = 1;
    }
    else {
        body.style.background = "linear-gradient( -45deg, rgba(236, 190, 176, 0.8), rgba(178, 219, 235, 0.8), rgba(189, 235, 224, 0.8))";
        header.style.color = "black";
        geekHaven_logo.src="./Assets/geekhaven_lightmode.png";
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
    // console.log(data);
    hasNext = data.has_next;
    addToTable(data.data);
    isFetching = false;
});
function addToTable(arr) {
    var i;
    for (i = 0; i < arr.length; i++) {
        name = arr[i].username;
        points = arr[i].totalPoints;
        fullname = arr[i].name;
        college = arr[i].college;
        if (lastScore !== points) {
            lastScore = points;
            rank++;
        }
        let rankClass = "";
        let rankToDisplay = rank;
        switch (rank) {
            case 1:
                rankToDisplay = `<img src='./Assets/gold.png' class='medal'>`;
                rankClass = "first";
                break;
            case 2:
                rankToDisplay = `<img src='./Assets/silver.png' class='medal'>`;
                rankClass = "second";
                break;
            case 3:
                rankToDisplay = `<img src='./Assets/bronze.png' class='medal'>`;
                rankClass = "third";
                break;

            default:
                rankToDisplay = rank;
                rankClass = "";
        }

        const markup = `
        <li class="user ${rankClass} zoom">
        <div class="rank">
        ${rankToDisplay}
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

            <ul class="dropdown_display dropdown_${rankClass}">
            <li><a href="https://github.com/${name}" ><img src="https://avatars.githubusercontent.com/${name}?size=200"></a></li>
            <table>
                <tr>
                    <td>NAME</td>
                    <td style = "text-transform:uppercase;">${fullname}</td>
                </tr>
                <tr>
                    <td>COLLEGE</td>
                    <td style = "text-transform:uppercase;">${college}</td>
                </tr>
            </table>
        </ul>
        </li>
         `;
        $('.rank-list').append(markup);
    }
}