/* eslint-disable require-jsdoc */
$(document).ready(async function() {
  const id=localStorage.getItem('userid');
  const admin = await getAdmin(id);

  $('#username').text(admin.name);
  $('#logout').on('click', function() {
    deleteSession();
    $(location).attr('href', 'login.html');
  });
});

async function getAdmin(id) {
  const admin = await $.ajax({
    url: 'http://localhost:3000/admin/' + id,
    method: 'GET',
    success: (x) => {
      // flag = 1;
      return x;
    },
    error: (x) => {
    },
  });
  return admin;
}
