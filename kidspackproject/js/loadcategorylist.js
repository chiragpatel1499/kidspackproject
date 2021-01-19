/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
$(document).ready(async function() {
  const categories = await getCategoryList();

  let categorycomponentstring = '<h4 class="h4">Quiz Categories</h4>';
  $.each(categories, function(index, value) {
    const categorytitle = '<h5 class="card-title  category-title">' + value.categoryname + '</h5>';
    const categorydescription = '<p class="card-text category-desc">' + value.categorydescription.substring(0, 100) + '...</p>';
    // var startbutton = '<button value' + index + ' class="btn btn-primary start-quiz">Start Quiz</button>';
    const startbutton = '<button id="start-quiz-button" onclick="onStartQuiz(\'' + value.categoryname + '\')" class="btn btn-primary start-quiz">Start Quiz</button>';

    categorycomponentstring += '<div class="category card my-5">' +
            '<div class="card-body row ">' +
            '<div class="col-md-12 col-lg-4 odd-left-container">' +
            categorytitle +
            '</div> <div class="col-md-12 col-lg-8 odd-right-container">' +
            categorydescription +
            startbutton +
            '</div> </div> </div>';
  });
  if (categories.length==0) {
    categorycomponentstring+='<div>Categories not available currently !!!!<br>Please be patient!!</div>';
  }
  $('#list-category').html(categorycomponentstring);
});

// eslint-disable-next-line no-unused-vars
function onStartQuiz(categoryname) {
  localStorage.setItem('categoryname', categoryname);

  $(location).attr('href', 'quizpage.html');
};


/** Fetch Category List */
async function getCategoryList() {
  const categoryList = await $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/category/',
    success: function(x) {
      // (x);
      return x;
    },
  });
  return categoryList;
}
