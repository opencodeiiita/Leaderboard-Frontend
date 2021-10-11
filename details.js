async function getData() {
  let res = await fetch(
    `https://opencodeiiita.herokuapp.com/get-all-data/?page=-1`
  );
  let data = await res.json();
  return data;
}
var data=getData();
var formEl = document.getElementById("searchForm");
formEl.addEventListener("submit", (e) => {

    populateTable();
    e.preventDefault();
    f=true;
  
})

function populateTable() {
  
  const username = document.getElementById("search").value;

  var table = document.getElementById("table");
  table.innerHTML='';
  var usernameSpan = document.getElementById("username");

  data.then((data) => {
    var userData = data.find((user) => user.username === username);
    if (userData) {
      var trh=document.createElement("tr");
      var th1=document.createElement("th");
      th1.innerText="Repo Name";
      var th2=document.createElement("th");
      th2.innerText="Issue #"
      
      var th3=document.createElement("th");
      th3.innerText="Points"
      trh.appendChild(th1);
      trh.appendChild(th2);
      trh.appendChild(th3);
      table.appendChild(trh);
      usernameSpan.innerHTML = username;
      var data = userData.pointPerPR;
      data.map((contribution) => {
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        td1.innerText = contribution.repoName;
        var td2 = document.createElement("td");
        td2.innerText = contribution.issueID;
        var td3 = document.createElement("td");
        td3.innerText = contribution.points;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        
        table.appendChild(tr);
        table.style.display = 'block';
      });
    } else {
      usernameSpan.innerHTML = "User not found!";
      table.style.display = 'none';
    }
  });

}
