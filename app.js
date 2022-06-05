window.onunload = function () {
  localStorage.removeItem('expenses');
  localStorage.removeItem('friends');
}

function reset(e){
  localStorage.clear('expenses');
  document.location.reload(true);
}

function firstCap(name){
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return(name);
}

document.getElementById('formExpense').addEventListener('submit', saveExpense);

function saveExpense(e){
  let name = firstCap(document.getElementById('name').value);
  let amount = document.getElementById('amount').value;

  let expense = {
    name,
    amount
  };

  if(!localStorage.getItem('expenses')) {
    let expenses = [];
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
  } else {
    let expenses = JSON.parse(localStorage.getItem('expenses'));
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  getExpense();
  document.getElementById('formExpense').reset();
  e.preventDefault();
}

function deleteExpense(name){
  let expenses = JSON.parse(localStorage.getItem('expenses'));
  for(let i = 0; i < expenses.length; i++) {
    if(expenses[i].name == name) {
      expenses.splice(i, 1);
    }
  }
  
  localStorage.setItem('expenses', JSON.stringify(expenses));
  getExpense();
}

function getExpense(){
  let expenses = JSON.parse(localStorage.getItem('expenses'));
  let count = document.getElementById("members").childElementCount;
  let expensesView = document.getElementById('expenses');
  expensesView.innerHTML = '';
  let sum = 0;
  let div = 1;
  let each = 0;

  if(expenses.length === 0){
    total.innerHTML = 'Total: $0';
    perPerson.innerHTML = '0';
  }

  if(expenses){
    for(let i = 0; i < expenses.length; i++) {
    let name = expenses[i].name;
    let amount = expenses[i].amount;

    expensesView.innerHTML += `<div class="card mb-3" id="${name}">
        <div class="card-body">
          <p>${name}- $${amount}
          <button class="btn btn-sm float-right" id="reset" onclick="deleteExpense('${name}')">X</button>
          </p>
        </div>
      </div>`;

    sum += parseInt(amount);
    total.innerHTML = 'Total: $' + sum;

    div = Math.round(sum / count);
    perPerson.innerHTML = div;
    }
  }
}

function addFriend(){
  let group = document.getElementById("name");
  let option = document.createElement("OPTION");
  let friend = firstCap(document.getElementById("friend").value);
  let members = document.getElementById("members");

  if(friend){
    option.innerHTML = friend;
    group.options.add(option);
    document.getElementById("friend").value = '';
    members.innerHTML += `<div class="card mb-3" ${friend}>
        <div class="card-body">
          <p>${friend} - $0
          <a href="#" onclick="deleteFriend('${friend}')" class="btn btn-sm float-right">X</a>
          </p>
        </div>
      </div>`;
  }
   let expense = {
    name: friend,
    amount: '0'
  };

  if(!localStorage.getItem('friends')) {
    let friends = [];
    friends.push(expense);
    localStorage.setItem('friends', JSON.stringify(friends));
  } else {
    let friends = JSON.parse(localStorage.getItem('friends'));
    friends.push(expense);
    localStorage.setItem('friends', JSON.stringify(friends));
  }
}

function division(){
  let expenses = JSON.parse(localStorage.getItem('expenses')).concat(JSON.parse(localStorage.getItem('friends')))
  let each = [];
  let count = document.getElementById("members").childElementCount;
  members.innerHTML = '';

  
  if(expenses){
    var output = expenses.reduce(function(o, cur) {
      var occurs = o.reduce(function(n, item, i) {
        return (item.name === cur.name) ? i : n;
      }, -1);
    
      if (occurs >= 0) {
        o[occurs].amount = o[occurs].amount.concat(cur.amount);
      } else {
        var obj = {
          name: cur.name,
          amount: [cur.amount]
        };
        o = o.concat([obj]);
      }
      return o;
    }, []);

        for(let i = 0; i < count; i++){
          let array = output[i].amount;
          let sum = 0;
    
          for(let j= 0; j < array.length; j++){
            let num = parseInt(array[j], 10);
            sum += num;
          }
    
          each.push(perPerson.innerHTML - sum);
        }
    
        for(let i = 0; i < each.length; i++) {
          let name = output[i].name;
         
          members.innerHTML += `<div class="card mb-3" id="${name}">
            <div class="card-body">
              <p>${name} - $ ${each[i]}
              </p>
            </div>
          </div>`;
    }
  }
}