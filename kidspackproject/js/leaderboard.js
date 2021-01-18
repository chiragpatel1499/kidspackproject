/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
$(document).ready(function() {
  $('#leaderboard-list').on('click', async function() {
    const leaderboarddata = await getLeaderBoard();
    const leaderboardtable = $('#leaderboardbody');
    let datastring = '';

    $.each(leaderboarddata, function(index, value) {
      const rank = '<td>#' + (parseInt(index + 1)) + '</td>';
      const name = '<td>' + value[2] + '</td>';
      const email = '<td>' + value[0] + '</td>';
      const percentage = '<td>' + value[1] + '%</td>';
      datastring += '<tr>' + rank + name + email + percentage + '</tr>';
    });
    if (datastring.length != 0) {
      leaderboardtable.html(datastring);
    } else {
      leaderboardtable.html('<td colspan=\'3\' >Be the first one to be on leaderboard!!!</td>');
    }
  });
});

async function getLeaderBoard() {
  const user = await getUsers();
  const quizResult = await getQuizResult();
  const scoreCount = {}; // {'email':score}
  const quizCount = {}; // {'email':quizCount}
  const percentageCount = {};
  const totalQuestion={};

  $.each(quizResult, function(index, value) {
    /** Count the number of quiz per user */
    if (quizCount[quizResult[index].email] == undefined) {
      quizCount[quizResult[index].email] = 1;
    } else {
      quizCount[quizResult[index].email] = quizCount[quizResult[index].email] + 1;
    }

    /** count the total score for per user with all quiz test */
    if (scoreCount[quizResult[index].email] == undefined) {
      scoreCount[quizResult[index].email] = parseInt(quizResult[index].score);
      totalQuestion[quizResult[index].email]=parseInt(quizResult[index].totalquestions);
    } else {
      const demoEmail = quizResult[index].email;
      scoreCount[quizResult[index].email] = parseInt(scoreCount[demoEmail]) + parseInt(quizResult[index].score);
      totalQuestion[demoEmail]=parseInt(quizResult[index].totalquestions)+ parseInt(totalQuestion[demoEmail]);
    }
  });
  /** Count the percentage of the user based on quiz count and score count */
  $.each(user, function(index, value) {
    if (scoreCount[user[index].email] != undefined) {
      percentageCount[user[index].email] = parseFloat(((scoreCount[user[index].email] / totalQuestion[user[index].email])) * 100).toPrecision(4);
    }
  });
  /** Create array from percentage json */
  const leaderBoard = Object.keys(percentageCount).map(function(key) {
    return [key, percentageCount[key]];
  });

  /** Sort the the leader board array   */
  leaderBoard.sort(function(first, second) {
    return second[1] - first[1];
  });


  /** Push the require detail in sorted array */
  $.each(leaderBoard, function(index) {
    const x = $(user).filter(function(i, n) {
      return leaderBoard[index][0] == n.email;
    });
    leaderBoard[index].push(x[0].firstname + ' ' + x[0].lastname);
  });

  return leaderBoard;
}

/** Get  user for leader board*/
async function getUsers() {
  const user = await $.ajax({
    url: 'http://localhost:3000/user/',
    method: 'GET',
    success: (x) => {
      // flag = 1;
      return x;
    },
    error: (x) => {
    },
  });
    // ("check flag " + user);
  return user;
}

/** get quiz result of all user  in leader board*/
async function getQuizResult() {
  const quizResultList = await $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/quizresult',
    success: function(x) {
      return x;
    },
  });
  return quizResultList;
}
