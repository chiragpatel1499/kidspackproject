$(document).ready(function() {
  $('#user-profile-list').on('click', async function() {
    const users = await getUsers();

    const userdetailstable= $('#user-profile-table');
    let datastring = '';
    $('#usercount').text('Total Users: '+users.length);
    $.each(users, function(index, value) {
      const srno = '<td>' + (parseInt(index + 1)) + '</td>';
      const name = '<td>' + value.firstname + ' ' + value.lastname + '</td>';
      const email = '<td>' + value.email + '</td>';
      const gender = '<td>' + value.gender + '</td>';
      const mobile = '<td>' + value.mob + '</td>';
      datastring += '<tr>' + srno + name + email + gender + mobile + '</tr>';
    });
    if (datastring.length != 0) {
      userdetailstable.html(datastring);
    } else {
      // eslint-disable-next-line max-len
      userdetailstable.html('<td colspan=\'3\' >Be patient Some one will come around soon!!!</td>');
    }
  });
});
