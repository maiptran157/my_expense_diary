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
var result = {};
/***************************************************************************************************
 * initializeApp 
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, including adding click handlers and pulling in any data from the server, in later versions
 */
function initializeApp() {
      addClickHandlersToElements();
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
      $(".getData").click(getDataFromServer);
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
      studentVal.course = $("#course").val();
      studentVal.grade = $("#studentGrade").val();
      studentArray.push(studentVal); //push to global student array
      updateStudentList();
      clearAddStudentFormInputs();
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs() {
      $("#studentName").val("");
      $("#course").val("");
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
                  studentArray.splice(indexOfCurrentStudent, 1);
                  newTr.remove();
                  renderGradeAverage();
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