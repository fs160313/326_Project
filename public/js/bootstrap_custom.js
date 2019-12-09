var title = document.getElementById('title');
var list = document.getElementById('loanlist');
var li = list.getElementsByTagName('li');
var addBtn = document.getElementById('add-Btn');
var loanBtn = document.getElementById('part_4');
var loan_data;


function activeItem() {
  title.innerHTML = this.innerText;
  for (var i = 0; i < li.length; i++) {
    li[i].removeAttribute('class');
  }
  this.setAttribute('class', 'active');
}
addBtn.addEventListener('click', function() {
  $('#modalLoanForm').modal('show');
});

loanBtn.addEventListener('click', function() {
  var amount = document.getElementById("part_1").value;
  var interest = document.getElementById("part_2").value;
  var sub = document.getElementById("part_3").value;
  //list.innerHTML += '<li class="list-group-item">' + "$" + amount + ",  %" + interest + ",  " + sub + '&nbsp;' + ' <button> - </button>' + '</li>';
  $("#loanlist").append(`<li><ul class='loanItem'><li class='amount'>${amount}</li><li class='interest'>${interest}</li><li class='subsidized'>${sub}</li></ul></li>`);
  $('#modalLoanForm').modal('hide');
  $('#modalLoanForm').trigger("reset");
});

$("ul").on("click", "button", function(e) {
  e.preventDefault();
  $(this).parent().remove();
});

$("#calculate")[0].addEventListener('click', function() {
  let grad_date = $("#months").children('option:selected').val() + " " + $("#year").val()
  let monthly_payment = $("#monthlypayment").val()
  let loans = [];
  let list = $("#loanlist");

  let json_object = {
    "monthly_payment": monthly_payment,
    "grad_date": grad_date,
    "loans": []
  }
  let loanItems = document.getElementsByClassName('loanItem');
  for (let i = 0; i < loanItems.length; i++){
    let amount = (loanItems[i].getElementsByClassName('amount')[0]).innerHTML;
    let interest = (loanItems[i].getElementsByClassName('interest')[0]).innerHTML;
    let subsidized = (loanItems[i].getElementsByClassName('subsidized')[0]).innerHTML;
    let loan = {
      "amount": amount,
      "interest": interest,
      "subsidized": subsidized === 'Subsidized'
    };
    json_object.loans.push(loan);
  }

  $.ajax({
    url: "http://localhost:7311/calculate",
    type: "POST",
    dataType: "json",
    data: json_object
  })
  .done(data => {
    console.log(data);
  });
});

$("#login")[0].addEventListener('click', function(){
  let user = $("#defaultForm-username")[0].value;
  let pass = $("#defaultForm-pass")[0].value;
  $.ajax({
    url: "http://localhost:7311/user",
    type: "GET",
    dataType: "json",
    data: {
      "username": user
    }
  }).done(data => {
    if(data.status == 'failure')
      window.alert('Invalid username or password.');
    else if(data.password != pass)
      window.alert('Invalid username or password.');
    else{
      document.cookie = 'loggedin=true';
      document.cookie =  `user=${user}`;
      location.reload();
      
    }
  });
});