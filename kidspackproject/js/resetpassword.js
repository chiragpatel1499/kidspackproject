$(document).ready(function () {
    $("#resetpassword").hide();
  
    $('#confirmnewpassword').keyup(function (e) {
      isConfirmPasswordValid();
    });
  
  
    $("#securityQuesForm").on("submit", async function (ev) {
  
      ev.preventDefault();
  
      var email = $("#securityemail").val();
      var question = $("#secuityquestion").val();
      var answer = $("#answer").val();
  
      $("#emailforreset").val(email);
  
      console.log(email);
  
  
      let user = await getUser(email);
  
      if (user.length > 0) {
        if (
          user[0].securityQuestion == question &&
          user[0].securityAnswer == answer
        ) {
  
          $("#securityquestiondiv").hide();
          $("#resetpassword").show();
        }
        else {
  
          $('#security-error-msg').text("Wrong Credentials!!");
        }
      }
      else {
        $('#security-error-msg').text("User does not exist");
      }
  
    });
  
  
    $("#resetPasswordForm").on("submit", async function (ev) {
      ev.preventDefault();
      let email = $("#emailforreset").val();
      let newPassword = md5( $("#newpassword").val());
      console.log(email);
      // let update={
      //     "password":newPassword
      // };
      // console.log(update);
  
      if (isConfirmPasswordValid()) {
  
        let user = await getUser(email);
        user[0].password = newPassword;
  
        console.log(user[0].password);
        var id = user[0].id;
        // var id="User-db0bf725-96a5-478c-87f0-16a9db29a012";
        $.ajax({
          method: "PUT",
          url: "http://localhost:3000/user/" + id,
          data: user[0],
          success: x => {
            console.log("Success " + x);
  
            deleteSession();
            
            $(location).attr("href", "login.html");
          },
          error: x => {
            console.log("Error");
          }
        });
  
      }
    });
  
  
  });
  
  
  function isConfirmPasswordValid() {
    var password = $("#newpassword");
    var confirmPass = $("#confirmnewpassword");
    if (password.val() != confirmPass.val()) {
      confirmPass[0].setCustomValidity('Password and confirm password is not same!!!!');
      return false;
    }
    else {
      confirmPass[0].setCustomValidity('');
      return true
    }
  }
  
  
  
  
  async function getUser(email) {
    let user = await $.ajax({
      url: "http://localhost:3000/user?email=" + email,
      method: "GET",
      success: x => {
        return x;
      },
      error: x => {
        console.log("Error");
      }
    });
    // console.log("check flag " + flag);
    return user;
  }