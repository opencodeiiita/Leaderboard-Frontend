var page = 1;
var rank = 0;
var lastScore = -1;
var hasNext = true;
let isFetching = true;
const $end = document.querySelector('#end');
const $logo = document.querySelector('#logo');
async function getData() {
    $logo.style.display = "";
    let res = await fetch(`https://opencodeiiita.herokuapp.com/get-all-data/?page=${page}`);
    let data = await res.json();
    $logo.style.display = "none";
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
        switch (rank) {
            case 1:
                markup =
                    '<tr style="background-color: gold;"><td>' +
                    rank +
                    '&nbsp;' +
                    '</td><td>' +
                    name +
                    '</td><td> ' +
                    '&nbsp;' +
                    points +
                    '</td></tr>';
                break;
            case 2:
                markup =
                    '<tr style="background-color: silver;"><td>' +
                    rank +
                    '&nbsp;' +
                    '</td><td>' +
                    name +
                    '</td><td> ' +
                    '&nbsp;' +
                    points +
                    '</td></tr>';
                break;
            case 3:
                markup =
                    '<tr style="background-color: goldenrod;"><td>' +
                    rank +
                    '&nbsp;' +
                    '</td><td>' +
                    name +
                    '</td><td> ' +
                    '&nbsp;' +
                    points +
                    '</td></tr>';
                break;

            default:
                markup =
                    '<tr><td class="index">' +
                    rank +
                    '&nbsp;' +
                    '</td><td>' +
                    name +
                    '</td><td> ' +
                    '&nbsp;' +
                    points +
                    '</td></tr>';
        }
        $('table tbody').append(markup);
    }
}