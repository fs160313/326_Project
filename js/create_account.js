(function() {
    'use strict';
    window.addEventListener('load', function() {
    $('.passwd').each(function(){
        this.addEventListener('keyup', function(event){
            if (document.getElementById("pass").value != document.getElementById("repass").value){
                document.getElementById("repass").setCustomValidity("Invalid Field.");
            }
            else{
                document.getElementById("repass").setCustomValidity("");
            }
        });
    });
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
    form.addEventListener('submit', function(event) {
    if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    }
    else{
        let email = $('#email').val();
        let user = $('#user').val();
        let pass = $('#pass').val();
        $.ajax({
            url: "http://localhost:7311/user",
            type: "POST",
            dataType: "json",
            data: {
              "username": user,
              "password": pass,
              "email": email,
              "monthly_payment": 0,
              "projected_salary": 0,
            }
          })
          .done(data => {
            console.log(data);
          });
    }
    form.classList.add('was-validated');
    }, false);
    });
    }, false);
    })();


