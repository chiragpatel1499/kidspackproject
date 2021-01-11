$(document).ready(function() {
  $("input:radio[name=role]").on("click", function() {
    // console.log("hii");
    if (this.value == "admin") {
      // $("#forgotpassword").hide();
      $(".mt-2").hide();
      // alert("hii");
    } else {
      $(".mt-2").show();
      // $("#forgotpassword").show();
    }
  });

  $("#loginForm").on("submit", async function(ev) {
    ev.preventDefault();
    var email = $("#email").val();
    var password = $("#password").val();

    var selected_Id = $('input[name="role"]:checked').attr("id");
    // console.log(selected_Id);
    if (selected_Id == "admin") {
      var admin = await getAdmin(email);
      if (admin.length == 0) {
        $("#error-msg").text("Invalid user Id or Password");
      }
      // console.log(admin[0].password);
      else {
        if (admin[0].password == password) {
          createSession(admin[0].id, email, "admin");

          $(location).attr("href", "admin.html");
        } else {
          $("#error-msg").text("Invalid user Id or Password");
        }
      }
    } else if (selected_Id == "user") {
      let user = await getUser(email);

      console.log("choose correct role " + user.length);

      if (user.length > 0) {
        var lgnData = {
          email: email,
          password: password
        };

        if (user[0].password === lgnData.password) {
          createSession(user[0].id, email, "user");

          $(location).attr("href", "userhomepage.html");
          console.log("User logged in");
        } else {
          $("#error-msg").text("Invalid user Id or Password");
        }
      } else {
        // console.log("User Does not Exist");   //does not go to this message if wrong email is entered.
        $("#error-msg").text("Invalid user Id or Password");
      }
    }
    // console.log(email, " ", password);
  });
});

async function getUser(email) {
  let user = await $.ajax({
    url: "http://localhost:3000/user?email=" + email,
    method: "GET",
    success: x => {
      // flag = 1;
      return x;
      // console.log("User exists");
    },
    error: x => {
      console.log("Error");
    }
  });
  console.log("check flag " + user);
  return user;
}

async function getAdmin(email) {
  let flag = 0;
  var admin = await $.ajax({
    url: "http://localhost:3000/admin?email=" + email,
    method: "GET",
    success: x => {
      return x;
    },
    error: x => {
      console.log("Error");
    }
  });
  return admin;
}
