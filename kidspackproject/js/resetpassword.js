/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
$(document).ready(function() {
  $('#resetpassword').hide();

  $('#confirmnewpassword').keyup(function(e) {
    isConfirmPasswordValid();
  });

  if (checkSession()) {
    const user = getUserSessionData();
    $('#securityemail').val(user.useremail);
    $('#securityemail').attr('disabled', true);
  }
  $('#securityQuesForm').on('submit', async function(ev) {
    ev.preventDefault();

    const email = $('#securityemail').val();
    const question = $('#secuityquestion').val();
    const answer = $('#answer').val();

    $('#emailforreset').val(email);


    const user = await getUser(email);

    if (user.length > 0) {
      if (
        user[0].securityQuestion == question &&
        user[0].securityAnswer == answer
      ) {
        $('#securityquestiondiv').hide();
        $('#resetpassword').show();
      } else {
        $('#security-error-msg').text('Wrong Credentials!!');
      }
    } else {
      $('#security-error-msg').text('User does not exist');
    }
  });


  $('#resetPasswordForm').on('submit', async function(ev) {
    ev.preventDefault();
    const email = $('#emailforreset').val();
    const newPassword = md5($('#newpassword').val());

    if (isConfirmPasswordValid()) {
      const user = await getUser(email);
      user[0].password = newPassword;

      const id = user[0].id;
      // var id="User-db0bf725-96a5-478c-87f0-16a9db29a012";
      $.ajax({
        method: 'PUT',
        url: 'http://localhost:3000/user/' + id,
        data: user[0],
        success: (x) => {
          deleteSession();

          $(location).attr('href', 'login.html');
        },
        error: (x) => {
        },
      });
    }
  });
});


function isConfirmPasswordValid() {
  const password = $('#newpassword');
  const confirmPass = $('#confirmnewpassword');
  if (password.val() != confirmPass.val()) {
    confirmPass[0].setCustomValidity('Password and confirm password is not same!!!!');
    return false;
  } else {
    confirmPass[0].setCustomValidity('');
    return true;
  }
}


async function getUser(email) {
  const user = await $.ajax({
    url: 'http://localhost:3000/user?email=' + email,
    method: 'GET',
    success: (x) => {
      return x;
    },
    error: (x) => {
    },
  });
  return user;
}
