/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */
var studentArray = [];
/***************************************************************************************************
 * initializeApp 
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, including adding click handlers and pulling in any data from the server, in later versions
 */
function initializeApp() {
      getDataFromServer();
      addClickHandlersToElements();
      renderOptionOfCoursesOnDOM();
}

/***************************************************************************************************
 * addClickHandlerstoElements
 * @params {undefined} 
 * @returns  {undefined}
 *     
 */
function addClickHandlersToElements() {
      $(".addStudent").click(handleAddClicked);
      $(".cancelStudent").click(handleCancelClick);
      // $(".getData").click(getDataFromServer);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked() {
      addStudent();
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick() {
      clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */

function addStudent() {
      var studentVal = {}; //local student object
      studentVal.name = $("#studentName").val();
      studentVal.course = $("#course option:selected").val();
      studentVal.grade = $("#studentGrade").val();
      studentArray.push(studentVal); //push to global student array
      updateStudentList();
      clearAddStudentFormInputs();
      sendDataToServer();
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs() {
      $("#studentName").val("");
      // $("#course").val("");
      $('select').prop('selectedIndex', 0)
      $("#studentGrade").val("");
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom() {
      var lastObjInStudentArray = studentArray[studentArray.length - 1];
      var newTr = $("<tr>", {
            class: "well"
      });
      var studentNameOuput = $("<td>", {
            class: "studentNameOuput",
            text: lastObjInStudentArray.name
      });
      var studentCourseOutput = $("<td>", {
            class: "studentCourseOutput",
            text: lastObjInStudentArray.course
      });
      var studentGradeOutput = $("<td>", {
            class: "studentGradeOutput",
            text: lastObjInStudentArray.grade
      });
      var deleteBtn = $("<td>").append($("<button>", {
            type: "button",
            class: "deleteBtn btn btn-danger",
            text: "Delete"
      }));
      (function () {
            deleteBtn.click(function () {
                  var indexOfCurrentStudent = studentArray.indexOf(lastObjInStudentArray);
                  var studentID = lastObjInStudentArray.id;
                  studentArray.splice(indexOfCurrentStudent, 1);
                  newTr.remove();
                  renderGradeAverage();
                  deleteStudentFromDatabase(studentID);
            })
      })();
      $(".student-list tbody").append(newTr);
      newTr.append(studentNameOuput, studentCourseOutput, studentGradeOutput, deleteBtn);
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList() {
      renderStudentOnDom();
      calculateGradeAverage();
      renderGradeAverage();
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage() {
      var totalGrade = 0;
      var gradeAverage = 0;
      for (var studentArrayIndex = 0; studentArrayIndex < studentArray.length; studentArrayIndex++) {
            totalGrade += parseInt(studentArray[studentArrayIndex].grade);
      };
      gradeAverage = totalGrade / (studentArray.length);
      if (isNaN(gradeAverage)) {
            gradeAverage = 0;
      }
      return gradeAverage;
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage() {
      $(".avgGrade").text(Math.round(calculateGradeAverage()));
}

function getDataFromServer() {
      $.ajax({
            url: "http://s-apis.learningfuze.com/sgt/get",
            dataType: 'JSON',
            method: 'POST',
            data: {
                  api_key: '3wi5PvJgB7'
            },
            success: function (serverResponse) {
                  var result = {};
                  result = serverResponse;
                  if (result.success) {
                        for (var i = 0; i < result.data.length; i++) {
                              studentArray.push(result.data[i]);
                              updateStudentList();
                        };
                  };
            }
      });
}

var courses = ['Accounting', 'Finance', 'Agriculture', 'American Studies', 'Anatomy', 'Anthropology', 'Archaeology', 'Architecture', 'Art',
      'Business & Management Studies', 'Chemistry', 'Civil Engineering', 'Computer Science', 'Counselling', 'Economics', 'English', 'Fashion',
      'Film Making', 'Forensic Science', 'French', 'Geography', 'Geology', 'History', 'Law', 'Marketing', 'Mathematics', 'Music',
      'Physics and Astronomy', 'Politics', 'Psychology', 'Robotics', 'Sociology'
]

function renderOptionOfCoursesOnDOM() {
      for (var i = 0; i < courses.length; i++) {
            var optionOfCourse = $("<option>", {
                  value: courses[i],
                  text: courses[i]
            })
            $('#course').append(optionOfCourse);
      }
}

function sendDataToServer() {
      var lastObjInStudentArray = studentArray[studentArray.length - 1];
      $.ajax({
            dataType: 'JSON',
            data: {
                  api_key: '3wi5PvJgB7',
                  name: lastObjInStudentArray.name,
                  course: lastObjInStudentArray.course,
                  grade: lastObjInStudentArray.grade,
                  id: lastObjInStudentArray.id
            },
            method: 'POST',
            url: 'http://s-apis.learningfuze.com/sgt/create',
            success: function (serverResponse) {
                  var result = serverResponse;
                  if (result.success) {
                        lastObjInStudentArray.id = result.new_id;
                        console.log('You have successfully sent data.');
                        console.log(result);
                  }
            },
            error: function (serverResponse) {
                  var result = serverResponse;
                  console.log('You have failed to send data.');
                  console.log(result);
            }
      })
}

function deleteStudentFromDatabase(idOfStudentToBeDeleted) {
      var studentID = idOfStudentToBeDeleted;
      $.ajax({
            method: 'POST',
            data: {
                  api_key: '3wi5PvJgB7',
                  student_id: studentID,
            },
            url: 'http://s-apis.learningfuze.com/sgt/delete',
            success: function (serverResponse) {
                  var result = serverResponse;
                  if (result.success) {
                        console.log('You have successfully deleted data.');
                  };
            },
      });
}