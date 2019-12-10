var title = document.getElementById('title');
var list = document.getElementById('loanlist');
var li = list.getElementsByTagName('li');
var addBtn = document.getElementById('add-Btn');
var loanBtn = document.getElementById('part_4');

window.addEventListener('load', function () {
  let cookies = document.cookie.split('; ');
  let loggedin = cookies[0];
  let user = cookies[1];
  let userid = cookies[2].replace('userid=', '');
  if (loggedin == 'loggedin=true') {
    //replace login/create acct buttons with logout button
    $('.hide-on-login')[0].before(`Logged in as ${user.replace('user=', '')}`);
    $('.hide-on-login').each(function () {
      $(this).addClass('d-none');
    })
    $('.show-on-login').each(function () {
      $(this).removeClass('d-none');
    });
    $('.show-on-login')[0].addEventListener('click', function () {
      document.cookie = 'loggedin=false';
      document.cookie = `user=${null}`;
      document.cookie = `userid=${null}`;
      location.reload(true);
    });
    //get loan information from server
    $.ajax({
      url: "http://localhost:7311/loan",
      type: "GET",
      dataType: "json",
      data: {
        'user_id': userid
      }
    }).done(data => {
      //propogate loanlist with loan information
      loans = data.loans;
      loans.forEach(element => {
        let amount = element.amount;
        let interest = element.interest;
        let sub;
        if (element.subsidized) sub = 'Subsidized';
        else sub = 'Unsubsidized';
        //$("#loanlist").append(`<li><ul class='loanItem'><li class='amount'>${amount}</li><li class='interest'>${interest}</li><li class='subsidized'>${sub}</li></ul><button>[-]</button></li>`);
        $("#loanlist").append('<li class="list-group-item d-flex justify-content-between align-items-center loanItem">' + 'Amount: <span class="badge badge-success amount">$' + amount + '</span>' + 'Interest: <span class="badge badge-secondary interest">' + interest + '%</span> ' + 'Type: <span class="badge badge-secondary subsidized">' + sub + '</span> <button onclick="" type="button" class="btn btn-sm btn-outline-danger">-</button></li>');
      });
    });
  }
});
function showDiv() {
  $("#calcDiv").fadeIn();
  document.getElementById('calcDiv').style.display = "block";
}

function activeItem() {
  title.innerHTML = this.innerText;
  for (var i = 0; i < li.length; i++) {
    li[i].removeAttribute('class');
  }
  this.setAttribute('class', 'active');
}
addBtn.addEventListener('click', function () {
  $('#modalLoanForm').modal('show');
});

loanBtn.addEventListener('click', function () {
  var amount = document.getElementById("part_1").value;
  var interest = document.getElementById("part_2").value;
  var sub = document.getElementById("part_3").value;
  //list.innerHTML += '<li class="list-group-item">' + "$" + amount + ",  %" + interest + ",  " + sub + '&nbsp;' + ' <button> - </button>' + '</li>';
  //$("#loanlist").append(`<li><ul class='loanItem'><li class='amount'>${amount}</li><li class='interest'>${interest}</li><li class='subsidized'>${sub}</li></ul><button onclick="">[-]</button></li>`);
  //$("#loanlist").append('<li class="list-group-item d-flex justify-content-between align-items-center">Interest: ' + interest + ', Type: ' + sub + '<span class="badge badge-success">$' + amount + '</span></li>');
  $("#loanlist").append('<li class="list-group-item d-flex justify-content-between align-items-center loanItem">' + 'Amount: <span class="badge badge-success amount">$' + amount + '</span>' + 'Interest: <span class="badge badge-secondary interest">' + interest + '%</span> ' + 'Type: <span class="badge badge-secondary subsidized">' + sub + '</span> <button onclick="" type="button" class="btn btn-sm btn-outline-danger">-</button></li>');

  $('#modalLoanForm').modal('hide');
  $('#modalLoanForm').trigger("reset");
});

$("ul").on("click", "button", function (e) {
  e.preventDefault();
  $(this).parent().remove();
});

$("#calculate")[0].addEventListener('click', function () {
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
  for (let i = 0; i < loanItems.length; i++) {
    let amount = (loanItems[i].getElementsByClassName('amount')[0]).innerHTML.replace('$', '');
    let interest = (loanItems[i].getElementsByClassName('interest')[0]).innerHTML.replace('%', '');
    let subsidized = (loanItems[i].getElementsByClassName('subsidized')[0]).innerHTML;
    console.log(amount, interest, subsidized);
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
      if (data.status == 'failure') {
        if (data.error == 'monthly_payment') {
          window.alert('Please add a monthly payment.')
        }
        else if (data.error == 'grad_date') {
          window.alert('please add a graduation year.')
        }
        event.preventDefault();
        event.stopPropagation();
      }


      $("#cons_month").html("");
      $("#cons_tint").html("");
      $("#cons_tpaid").html("");

      $("#hf_month").html("");
      $("#hf_tint").html("");
      $("#hf_tpaid").html("");

      $("#w_month").html("");
      $("#w_tint").html("");
      $("#w_tpaid").html("");

      $('#cons_month').append(data.consolidated_months);
      $('#cons_tint').append("$" + data.consolidated_total_interest);
      $('#cons_tpaid').append("$" + data.consolidated_total_paid);

      $('#hf_month').append(data.highest_first_months);
      $('#hf_tint').append("$" + data.highest_first_total_interest);
      $('#hf_tpaid').append("$" + data.highest_first_total_paid);

      $('#w_month').append(data.weighted_months);
      $('#w_tint').append("$" + data.weighted_total_interest);
      $('#w_tpaid').append("$" + data.weighted_total_paid);

      makeGraphs(data);
    });

  function makeGraphs(data) {
    var border_color = ['rgba(75, 192, 192, 1)', 'rgba(192, 0, 0, 1)'];
    var background_color = ['rgba(75, 192, 192, 0.2)', 'rgba(192, 0, 0, 0.2)'];

    // Bar Graph
    var bar_data = {
      labels: ['Consolidated', 'Highest First', 'Weighted'],
      datasets: [
        {
          label: 'Principal',
          data: [data.principal, data.principal, data.principal],
          backgroundColor: [background_color, background_color, background_color]
        },
        {
          label: 'Interest',
          data: [data.consolidated_total_interest, data.highest_first_total_interest, data.weighted_total_interest],
          backgroundColor: [border_color, border_color, border_color]
        }

      ]
    };
    var stacked_bar = document.getElementById("stackedBarChart").getContext('2d');
    var stackedBar = new Chart(stacked_bar, {
      type: 'bar',
      data: bar_data,
      options: {
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
    });

    // Pie Charts
    var pie_labels = [
      "Principal",
      "Interest",
    ];
    // // Consolidated
    var pie_data_consolidated = [data.principal, data.consolidated_total_interest];
    var consolidated_pie = document.getElementById("pieChartConsolidated").getContext('2d');
    var myChart = new Chart(consolidated_pie, {
      type: 'pie',
      data: {
        labels: pie_labels,
        datasets: [
          {
            data: pie_data_consolidated,
            borderColor: border_color,
            backgroundColor: background_color,
          }
        ]
      },
      options: {
        title: {
          display: true,
        }
      }
    });
    // // Highest First
    var pie_data_highest = [data.principal, data.highest_first_total_interest];
    var highest_pie = document.getElementById("pieChartHighest").getContext('2d');
    var myChart = new Chart(highest_pie, {
      type: 'pie',
      data: {
        labels: pie_labels,
        datasets: [
          {
            data: pie_data_highest,
            borderColor: border_color,
            backgroundColor: background_color,
          }
        ]
      },
      options: {
        title: {
          display: true,
        }
      }
    });
    // // Weighted
    var pie_data_weighted = [data.principal, data.weighted_total_interest];
    var weighted_pie = document.getElementById("pieChartWeighted").getContext('2d');
    var myChart = new Chart(weighted_pie, {
      type: 'pie',
      data: {
        labels: pie_labels,
        datasets: [
          {
            data: pie_data_weighted,
            borderColor: border_color,
            backgroundColor: background_color,
          }
        ]
      },
      options: {
        title: {
          display: true,
        }
      }
    });
    // Line Charts
    // // Consolidated
    var months = data.line_chart.months;
    var paid_so_far_consolidated = data.line_chart.line_chart_consolidated_spent;
    var left_to_pay_consolidated = data.line_chart.line_chart_consolidated_left;
    new Chart(document.getElementById("lineChartConsolidated"), {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          data: paid_so_far_consolidated,
          label: "Total Paid",
          borderColor: background_color,
          fill: true
        }, {
          data: left_to_pay_consolidated,
          label: "Left To Pay",
          borderColor: border_color,
          fill: false
        }
        ]
      },
      options: {
        title: {
          display: false,
          text: 'Money Over Time'
        }
      }
    });
    // // Highest First
    var months = data.line_chart.months;
    var paid_so_far_highest = data.line_chart.line_chart_highest_spent;
    var left_to_pay_highest = data.line_chart.line_chart_highest_left;
    new Chart(document.getElementById("lineChartHighest"), {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          data: paid_so_far_highest,
          label: "Total Paid",
          borderColor: background_color,
          fill: true
        }, {
          data: left_to_pay_highest,
          label: "Left To Pay",
          borderColor: border_color,
          fill: false
        }
        ]
      },
      options: {
        title: {
          display: false,
          text: 'Money Over Time'
        }
      }
    });
    // // Weighted 
    var months = data.line_chart.months;
    var paid_so_far_weighted = data.line_chart.line_chart_weighted_spent;
    var left_to_pay_weighted = data.line_chart.line_chart_weighted_left;
    new Chart(document.getElementById("lineChartWeighted"), {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          data: paid_so_far_weighted,
          label: "Total Paid",
          borderColor: background_color,
          fill: true
        }, {
          data: left_to_pay_weighted,
          label: "Left To Pay",
          borderColor: border_color,
          fill: false
        }
        ]
      },
      options: {
        title: {
          display: false,
          text: 'Money Over Time'
        }
      }
    });
  }
})

$("#login")[0].addEventListener('click', function () {
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
    if (data.status == 'failure')
      window.alert('Invalid username or password.');
    else if (data.password != pass)
      window.alert('Invalid username or password.');
    else {
      console.log(data);
      document.cookie = 'loggedin=true';
      document.cookie = `user=${user}`;
      document.cookie = `userid=${data._id}`;
      location.reload();
    }
  });
});
$("#save")[0].addEventListener('click', function () {
  let loansarr = [];
  let cookies = document.cookie.split('; ');
  let loggedin = cookies[0];
  let user = cookies[1];
  let userid = cookies[2];

  // $.ajax({
  //   url: "http://localhost:7311/loan",
  //   type: "DELETE",
  //   dataType: "json",
  //   data: {
  //     'user_id': cookies[2].replace('userid=', '')
  //   }
  // });

  let loanItems = document.getElementsByClassName('loanItem');
  for (let i = 0; i < loanItems.length; i++) {
    let amount = (loanItems[i].getElementsByClassName('amount')[0]).innerHTML.replace('$', '');
    let interest = (loanItems[i].getElementsByClassName('interest')[0]).innerHTML.replace('%', '');
    let subsidized = (loanItems[i].getElementsByClassName('subsidized')[0]).innerHTML;
    let loan = {
      "amount": amount,
      "interest": interest,
      "subsidized": subsidized === 'Subsidized'
    };
    loansarr.push(loan);
  }
  $.ajax({
    url: "http://localhost:7311/loan",
    type: "POST",
    dataType: "json",
    data: {
      'user_id': cookies[2].replace('userid=', ''),
      'loans': loansarr
    }
  }).done(window.alert("Loans saved successfully."));
});

