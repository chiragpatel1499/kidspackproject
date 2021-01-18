/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

class userData {
  constructor(id, firstname, lastname, gender, email, password, mob, securityQuestion, securityAnswer) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.gender = gender;
    this.email = email;
    this.password = password;
    this.mob = mob;
    this.securityQuestion = securityQuestion;
    this.securityAnswer = securityAnswer;
  }
}

$(document).ready(function() {
  $('#mobile').keyup(() => {
    isValidMobile();
  });

  $('#confirmpass').keyup(function(e) {
    isConfirmPasswordValid();
  });


  $('#registrationForm').on('submit', async function(e) {
    e.preventDefault();

    const firstname = $('#firstname').val();
    const lastname = $('#lastname').val();
    const gender = $('input[name=gender]:checked').val();
    const email = $('#email').val();
    const mob = $('#mobile').val();
    const password = md5($('#password').val());
    const securityque = $('#securityque').val();
    const securityans = $('#securityans').val();

    if (isFormValid()) {
      const userId = 'User-' + uuidv4();


      const flag = (await isUserExist(email));
      if (!flag) {
        const userdata = new userData(userId, firstname, lastname, gender, email, password, mob, securityque, securityans);
        addUser(userdata);


        $(location).attr('href', 'login.html');
      } else {
        $('#error-msg').text('User account with this Email Id Already exists!!!!');
      }
    }
  });
});


function isValidMobile() {
  const mobile = $('#mobile');

  if (!mobile.val().match(/^[6-9]{1}[0-9]{9}$/)) {
    mobile[0].setCustomValidity('Mobile number only have 10 digit and must be valid');
    return false;
  } else {
    mobile[0].setCustomValidity('');
  }
  return true;
}

function isConfirmPasswordValid() {
  const password = $('#password');
  const confirmPass = $('#confirmpass');
  if (password.val() != confirmPass.val()) {
    confirmPass[0].setCustomValidity('Password and confirm password is not same!!!!');
    return false;
  } else {
    confirmPass[0].setCustomValidity('');
    return true;
  }
}

function isFormValid() {
  if (!isValidMobile()) {
    return false;
  }
  if (!isConfirmPasswordValid()) {
    return false;
  }

  return true;
}

// Unique Id generator
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
  );
}

// Check User's Existance
async function isUserExist(email) {
  let flag = false;
  await $.ajax({
    url: 'http://localhost:3000/user?email=' + email,
    method: 'GET',
    success: function(x) {
      if (x.length > 0) {
        flag = true;
      } else {
        //  return false;
        flag = false;
      }
      return flag;
    },
    error: (x) => {
    },

  });

  return flag;
}


// Add the user by Registered Data
function addUser(userdata) {
  $.ajax({
    url: 'http://localhost:3000/user/',
    method: 'POST',
    data: userdata,
    dataType: 'JSON',
    success: (x) => {
    },
    error: (x) => {
    },
  });
}
