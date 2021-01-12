
class userData {
    constructor(id, firstname, lastname, email, password, mob, securityQuestion, securityAnswer) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.mob = mob;
        this.securityQuestion = securityQuestion;
        this.securityAnswer = securityAnswer;
    }
}

$(document).ready(function () {



    $('#mobile').keyup(() => {
        isValidMobile();
    });

    $('#confirmpass').keyup(function (e) {
        isConfirmPasswordValid();
    });


    $("#registrationForm").on('submit', async function (e) {
        e.preventDefault();

        var firstname = $("#firstname").val();
        var lastname = $("#lastname").val();
        var gender = $("input[name=gender]:checked").val();
        var email = $("#email").val();
        var mob = $("#mobile").val();
        var password = $("#password").val();
        var securityque = $('#securityque').val();
        var securityans = $('#securityans').val();

        if (isFormValid()) {

            var userId = "User-" + uuidv4();

            console.log("trying to add user");
            
            var flag = (await isUserExist(email));
            console.log(flag);
            if (!flag) {
                let userdata = new userData(userId, firstname, lastname, email, password, mob, securityque, securityans.toLowerCase());
                addUser(userdata);


                $(location).attr("href", "login.html");


            }
            else {
                $('#error-msg').text('User account with this Email Id Already exists!!!!');
            }
        }

    });
});



function isValidMobile() {
    var mobile = $('#mobile');

    if (!mobile.val().match(/^[6-9]{1}[0-9]{9}$/)) {
        mobile[0].setCustomValidity('Mobile number only have 10 digit and must be valid');
        return false;
    }
    else {
        mobile[0].setCustomValidity('');
    }
    return true;
}

function isConfirmPasswordValid() {
    var password = $("#password");
    var confirmPass = $("#confirmpass");
    if (password.val() != confirmPass.val()) {
        confirmPass[0].setCustomValidity('Password and confirm password is not same!!!!');
        return false;
    }
    else {
        confirmPass[0].setCustomValidity('');
        return true
    }
}

function isFormValid() {

    
    if (!isValidMobile(mobile)) {
        return false;
    }
    else if (!isConfirmPasswordValid()) {
        return false;
    }

    return true;

}

// Unique Id generator
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

// Check User's Existance
async function isUserExist(email) {

    let flag = false;
    await $.ajax({
        url: "http://localhost:3000/user?email=" + email,
        method: "GET",
        success: function (x) {
            if (x.length > 0) {
                console.log("wqdf");
                console.log(x);

                flag = true;
            } else {
                //  return false;
                flag = false;
            }
            return flag;
        },
        error: (x) => {
            console.log("Error");
        }

    });

    return flag;
}


// Add the user by Registered Data
function addUser(userdata) {
    $.ajax({
        url: "http://localhost:3000/user/",
        method: "POST",
        data: userdata,
        dataType: "JSON",
        success: (x) => {
            console.log("Success");
            console.log(x);
        },
        error: (x) => {
            console.log("Error");
            console.log(x);
        }
    })

}