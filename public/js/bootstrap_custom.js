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
  $("#loanlist").append(`<li>
                      <ul>
                        <li class='amount'>
                          ${amount}
                        </li>
                        <li class='interest'>
                          ${interest}
                        </li>
                        <li class='subsidized'>
                          ${sub}
                        </li>
                      </ul>
                  </li>`);
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
  
    
    // console.log(loan);
    // loanamt = $(this).getElementById('amount');
    // interestamt = $(this).getElementById('interest');
    // sub = $(this).getElementById('subsidized');
    // loan['']
    // // let loan = [($(this).val())[0], ($(this).val())[1], ($(this).val())[2]]
    // // loans.push(loan);
  })
  //console.log(loans);
})