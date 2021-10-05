var page = 1;
var rank = 0;
var lastScore = -1;
var hasNext = true;
var previousFetched = Date.now();
const $end = document.querySelector('#end');
async function getData() {
    let res = await fetch(`https://opencodeiiita.herokuapp.com/get-all-data/?page=${page}`);
    let data = await res.json();
    return data;
}
window.addEventListener('scroll', () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight > scrollHeight - 5) {
        page++;
        if (hasNext) {
            previousFetched = Date.now();
            getData().then(data => {
                console.log(data);
                hasNext = data.has_next;
                addToTable(data.data);
            });
        }
        else {
            $end.style.display = "block";
        }
        // setTimeout(createPost, 2000);       
    }

});
getData().then(data => {
    console.log(data);
    hasNext = data.has_next;
    addToTable(data.data);
});

function addToTable(arr) {
    // var set = new Set();
    // for (i = 0; i < arr.length; i++) {
    //     set.add(arr[i].totalPoints);
    // }

    var i;
    for (i = 0; i < arr.length; i++) {
        let name = arr[i].username;
        let points = arr[i].totalPoints;
        if ((points <= lastScore && points !== lastScore) || lastScore === -1) {
            lastScore = points;
            rank++;
        }
        // rank = [...set].indexOf(arr[i].totalPoints) + 1;
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
                    '<tr><td>' +
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