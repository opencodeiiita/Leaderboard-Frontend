async function getData() {
    let res = await fetch(`https://opencodeiiita.herokuapp.com/get-all-data/?page=-1`);
    let data = await res.json();

    var inp = document.getElementById('search');
    inp.removeAttribute('disabled');
    inp.setAttribute('placeholder', 'Search');
    var ar = [];

    inp.addEventListener('input', async e => {
        ar = [];
        $('#searchList').empty();
        var list = document.getElementById('searchList');
        let val = document.getElementById('search').value;
        val = val.toUpperCase();
        if (val.length) {
            for (i = 0; i < data.length; i++) {
                if (ar.length === 10) break;
                x = data[i].username.toUpperCase();

                if (x.includes(val) && ar.length < 10) {
                    ar.push(data[i].username);
                    var searchItem = document.createElement('li');
                    var btn = document.createElement('BUTTON');
                    btn.innerText = ar[ar.length - 1];
                    btn.setAttribute('value', ar[ar.length - 1]);
                    btn.addEventListener('click', e => {
                        document.getElementById('search').value = e.target.value;
                        populateTable();
                        $('#searchList').empty();
                    });
                    searchItem.appendChild(btn);

                    list.appendChild(searchItem);
                }
            }
        }
    });
    return data;
}
var data = getData();
var formEl = document.getElementById('searchForm');

formEl.addEventListener('submit', e => {
    populateTable();
    e.preventDefault();
});

function populateTable() {
    const username = document.getElementById('search').value;

    var table = document.getElementById('table');
    table.innerHTML = '';
    var usernameSpan = document.getElementById('username');

    data.then(data => {
        var userData = data.find(user => user.username === username);
        if (userData) {
            var trh = document.createElement('tr');
            var th1 = document.createElement('th');
            th1.innerText = 'Repo Name';
            var th2 = document.createElement('th');
            th2.innerText = 'Issue #';

            var th3 = document.createElement('th');
            th3.innerText = 'Points';
            trh.appendChild(th1);
            trh.appendChild(th2);
            trh.appendChild(th3);
            table.appendChild(trh);
            usernameSpan.innerHTML = username;
            var data = userData.pointPerPR;
            data.map(contribution => {
                var tr = document.createElement('tr');
                var td1 = document.createElement('td');
                td1.innerHTML = `<a href= "https://github.com/opencodeiiita/${contribution.repoName}">${contribution.repoName}</a>`;
                var td2 = document.createElement('td');
                td2.innerHTML = `<a href ="https://github.com/opencodeiiita/${contribution.repoName}/issues/${contribution.issueID}"> ${contribution.issueID} </a>`;
                var td3 = document.createElement('td');
                td3.innerHTML = contribution.points;
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);

                table.appendChild(tr);
                table.style.display = 'block';
            });
        } else {
            usernameSpan.innerHTML = 'User not found!';
            table.style.display = 'none';
        }
    });
}
