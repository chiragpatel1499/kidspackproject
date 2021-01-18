/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable camelcase */
$(document).ready(function() {
  $('input:radio[name=role]').on('click', function() {
    if (this.value == 'admin') {
      // $("#forgotpassword").hide();
      $('.mt-2').hide();
      // alert("hii");
    } else {
      $('.mt-2').show();
      // $("#forgotpassword").show();
    }
  });

  $('#loginForm').on('submit', async function(ev) {
    ev.preventDefault();
    const email = $('#email').val();
    const password = md5($('#password').val());

    const selected_Id = $('input[name="role"]:checked').attr('id');
    if (selected_Id == 'admin') {
      const admin = await getAdmin(email);
      if (admin.length == 0) {
        $('#error-msg').text('Invalid user Id or Password');
      } else {
        if (admin[0].password == password) {
          createSession(admin[0].id, email, 'admin');

          $(location).attr('href', 'adminhome.html');
        } else {
          $('#error-msg').text('Invalid user Id or Password');
        }
      }
    } else if (selected_Id == 'user') {
      const user = await getUser(email);


      if (user.length > 0) {
        const lgnData = {
          email: email,
          password: password,
        };

        if (user[0].password === lgnData.password) {
          createSession(user[0].id, email, 'user');

          $(location).attr('href', 'userhomepage.html');
        } else {
          $('#error-msg').text('Invalid user Id or Password');
        }
      } else {
        $('#error-msg').text('Invalid user Id or Password');
      }
    }
  });
});

async function getUser(email) {
  const user = await $.ajax({
    url: 'http://localhost:3000/user?email=' + email,
    method: 'GET',
    success: (x) => {
      // flag = 1;
      return x;
    },
    error: (x) => {
    },
  });
  return user;
}

async function getAdmin(email) {
  const admin = await $.ajax({
    url: 'http://localhost:3000/admin?email=' + email,
    method: 'GET',
    success: (x) => {
      return x;
    },
    error: (x) => {
    },
  });
  return admin;
}
