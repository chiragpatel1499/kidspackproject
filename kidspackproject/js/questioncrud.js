/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
class Question {
  constructor(id, category, question, options, answer, questionImage) {
    this.id = id;
    this.category = category;
    this.question = question;
    this.options = options;
    this.answer = answer;
    this.questionImage=questionImage;
  }
}

let questionList;
let selectedAnswer=null;
let selectedCategory1=null;
let selectedCategory2=null;
let editedAnswer;
let questionid;
let questionListToDisplay;

$(document).ready(async function() {
  // $('#question-list').on('click',async function(){

  const categorylist=await getCategoryList();
  let datastring='';
  $.each(categorylist, function(index, value) {
    const item='<a class="dropdown-item" href="#" >'+value.categoryname+'</a>';
    datastring+=item;
  });
  $('#select-category-2').html(datastring);
  datastring='<a class="dropdown-item" href="#" >All Categories</a>'+datastring;
  $('#select-category-1').html(datastring);

  questionList = await getQuestionList();
  questionListToDisplay = questionList;

  // by default display questions of  all type of categories
  displayQuestions(questionList);

  // });
  // let optionList=[];
  // for(let question in questionList){
  //     let optionArray=questionList[question]['options[]'];
  //     for(let optionArray1 in optionArray){
  //         optionList.push(optionArray[optionArray1]);
  //     }
  //     let id=questionList[question]['id'];
  //     $('#questionListDiv').append("<button onclick='getQuestionDetailByID(\""+id+"\")'>Update</button><button onclick='deleteQuestion(\""+id+"\")'>delete</button><p>"+questionList[question]['question']+"</p><ul><li>"+optionList[0]+"</li><li>"+optionList[1]+"</li><li>"+optionList[2]+"</li><li>"+optionList[3]+"</li></ul>");
  //     optionList=[];
  // }

  $('#add-question-modal').on('click', async function() {
    selectedAnswer=null;
    selectedCategory2=null;
  });

  $('#select-category-2 a').on('click', function() {
    selectedCategory2=this.text;
    $('#selectedCatagoryDisplay').text(this.text);
  });
  $('#select-category-1 a').on('click', function() {
    selectedCategory1 = this.text;
    $('#dropdownMenuButtonOutside').text(this.text);
    if (selectedCategory1 == 'All Categories') {
      displayQuestions(questionList);
    } else {
      questionListToDisplay = questionList.filter((question) => question.category === selectedCategory1);
      displayQuestions(questionListToDisplay);
    }
  });

  $('#edit-answer a').on('click', function() {
    editedAnswer=$('#'+$(this).attr('value')).val();
    $('#dropdownMenuButton').text(editedAnswer);
  });

  $('#select-answer-1 a').on('click', function() {
    selectedAnswer=$('#'+$(this).attr('value')).val();
    $('#answer').text(this.text);
  });
  $('#questionImage , #questionImageUpdate').on('change', function() {
    if (this.files[0].size > 307200) {
      alert('File is too big!');
      this.value = '';
    };
  });

  $('#question-add-form').on('submit', async function(ev) {
    ev.preventDefault();
    alert('hello');
    let category = selectedCategory2;
    if (selectedCategory2==null) {
      $('#error-msg-add').text('please select category first!!');
    } else if (selectedAnswer==null) {
      $('#error-msg-add').text('please select option for correct answer!!!');
    } else {
      category=selectedCategory2;
      const question = $('#question').val();
      const optionA = $('#option-1').val();
      const optionB = $('#option-2').val();
      const optionC = $('#option-3').val();
      const optionD = $('#option-4').val();
      const questionImage = $('#questionImage').prop('files')[0];
      let questionImageBase=null;
      if (questionImage) {
        const reader = new FileReader();
        reader.readAsDataURL(questionImage);
        reader.addEventListener('load', async function() {
          // convert image file to base64 string
          questionImageBase = reader.result;
          const answer = selectedAnswer;
          const options = [optionA, optionB, optionC, optionD];
          const id = 'questions-' + uuidv4();
          const questionObject = new Question(id, category, question, options, answer, questionImageBase);
          await addQuestion(questionObject);
        }, false);
      } else {
        const answer = selectedAnswer;
        const options = [optionA, optionB, optionC, optionD];
        const id = 'questions-' + uuidv4();
        const questionObject = new Question(id, category, question, options, answer, questionImageBase);
        await addQuestion(questionObject);
      }
    }
  });

  $('#question-update-form').on('submit', async function(ev) {
    ev.preventDefault();

    await updateQuestion();
    // location.reload();
  });

  $('#delete-question-button').on('click', async function() {
    await deleteQuestion(questionid);
  });
});

// display questions in table in admin question crud tab
function displayQuestions(questions) {
  let datastring = '';
  const questionlistbody = $('#questionlistbody');
  $.each(questions, function(index, value) {
    const srno = '<td>' + (parseInt(index + 1)) + '</td>';
    const que = '<td>' + value.question + '</td>';
    const categoryname = '<td>' + value.category + '</td>';
    const editbutton = '<a data-bs-target="#editQuestionModal" onclick="updateModal(' + index + ')" class="edit" data-bs-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>';
    const deletebutton = '  <a data-bs-target="#deleteQuestionModal" onclick="deleteModal(\'' + value.id + '\')" class="delete" data-bs-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>';
    datastring += '<tr>' + srno + que + categoryname + '<td>' + editbutton + deletebutton + '</td></tr>';
  });
  if (datastring.length != 0) {
    questionlistbody.html(datastring);
  } else {
    questionlistbody.html('<td colspan=\'4\' >Add Questions to create valid QUIZ!!!</td>');
  }
}

function deleteModal(id) {
  questionid=id;
}

function updateModal(index) {
  const currentQuestion=questionListToDisplay[index];
  $('#edit-question-id').val(questionListToDisplay[index].id);
  $('#edit-question').val(questionListToDisplay[index].question);
  $('#edit-option-1').val(questionListToDisplay[index]['options[]'][0]);
  $('#edit-option-2').val(questionListToDisplay[index]['options[]'][1]);
  $('#edit-option-3').val(questionListToDisplay[index]['options[]'][2]);
  $('#edit-option-4').val(questionListToDisplay[index]['options[]'][3]);
  $('#dropdownMenuButton').text(questionListToDisplay[index].answer);

  editedAnswer=currentQuestion.answer;
  // let question=$('')
}

// Create Uniq Universal ID
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
  );
}

// Add Question to database
function addQuestion(question) {
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/questions/',
    data: question,
    success: function(response) {
      location.reload();
    },
  });
}

// Give Json object of Question List
async function getQuestionList() {
  const questionList = await $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/questions/',
    success: function(x) {
      return x;
    },
  });
  return questionList;
}

// Fetch Qestion Detail By ID in update
// async function getQuestionDetailByID(id){
//     let question= await $.ajax({
//         method: "GET",
//         url: 'http://localhost:3000/questions/'+id,
//         success: function (x) {
//         //     let optionList=[];
//         //     let optionArray=x['options[]']
//         //     for(let optionArray1 in optionArray){
//         //         optionList.push(optionArray[optionArray1]);
//         //     }
//         //     alert(`Select Category : <select name="category" id="category2">
//         //     </select>
//         //     <br>
//         //   Enter question:<input type="text" id="question" value="`+x.question+`"required><br>
//         //   Option A:<input type="text" id="a" value="`+optionList[0]+`"required><br>
//         //   Option B:<input type="text" id="b" value="`+optionList[1]+`"required><br>
//         //   Option C:<input type="text" id="c" value="`+optionList[2]+`"required><br>
//         //   Option D:<input type="text" id="d" value="`+optionList[3]+`"required><br>
//         //   Answer  <select name="answer" id="answer">
//         //       <option value="a">A</option>
//         //       <option value="b">B</option>
//         //       <option value="c">C</option>
//         //       <option value="d">D</option>
//         //     </select>
//         //   <br>
//         //   <input type="submit" value="Add Question" onclick="onQuestionSubmit()">`);
//         return x;
//         }
//     });
//     return question;
// }

// Delete Question based on ID
async function deleteQuestion(id) {
  await $.ajax({
    method: 'DELETE',
    url: 'http://localhost:3000/questions/' + id,
    success: function(x) {
      location.reload();
    },
    error: function(e) {
    },
  });
}


async function updateQuestion() {
  const id =$('#edit-question-id').val();
  const question = $('#edit-question').val();
  const optionA = $('#edit-option-1').val();
  const optionB = $('#edit-option-2').val();
  const optionC = $('#edit-option-3').val();
  const optionD = $('#edit-option-4').val();
  const options = [optionA, optionB, optionC, optionD];

  const questionImage = $('#questionImageUpdate').prop('files')[0];
  let questionImageBase=null;
  if (questionImage) {
    const reader = new FileReader();
    reader.readAsDataURL(questionImage);
    reader.addEventListener('load', async function() {
      // convert image file to base64 string
      questionImageBase = reader.result;
      const data = {
        'question': question,
        'options': options,
        'answer': editedAnswer,
        'questionImage': questionImageBase,
      };
      await $.ajax({
        method: 'PATCH',
        url: 'http://localhost:3000/questions/' + id,
        data: data,
        success: function(x) {
          // alert(response);
        },
      });
      location.reload();
    }, false);
  } else {
    const data = {
      'question': question,
      'options': options,
      'answer': editedAnswer,
    };
    await $.ajax({
      method: 'PATCH',
      url: 'http://localhost:3000/questions/' + id,
      data: data,
      success: function(x) {
        // alert(response);
      },
    });
    location.reload();
  }
}

async function getCategoryList() {
  const categoryList= await $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/category/',
    success: function(x) {
      return x;
    },
  });
  return categoryList;
}
