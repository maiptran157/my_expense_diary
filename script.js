/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready();

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
var student_array = [];
/***************************************************************************************************
 * initializeApp 
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, including adding click handlers and pulling in any data from the server, in later versions
 */
function initializeApp() {}

/***************************************************************************************************
 * addClickHandlerstoElements
 * @params {undefined} 
 * @returns  {undefined}
 *     
 */
function addClickHandlersToElements() {}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked() {
      addStudent()
      console.log(student_array);
      updateStudentList();
      clearAddStudentFormInputs()
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick() {
      clearAddStudentFormInputs()
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent() {
      var studentVal = {};
      studentVal.name = $("#studentName").val();
      studentVal.course = $("#course").val();
      studentVal.grade = $("#studentGrade").val();
      student_array.push(studentVal);
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
      var newTr = $("<tr>",{
            class: "well"
      })
      var studentNameOuput = $("<td>", {
            class: "studentNameOuput"
      })
      var studentCourseOutput = $("<td>", {
            class: "studentCourseOuput"
      })
      var studentGradeOutput = $("<td>", {
            class: "studentGradeOutput"
      })
      var deleteBtn = $("<td>").append($("<button>", {
            type: "button",
            class: "btn btn-danger",
            onclick: "",
            text: "Delete"
      }))
      var lastObjInStudentArray = student_array[student_array.length - 1]
      studentNameOuput.text(lastObjInStudentArray.name);
      studentCourseOutput.text(lastObjInStudentArray.course);
      studentGradeOutput.text(lastObjInStudentArray.grade);
      $(".student-list tbody").append(newTr)
      newTr.append(studentNameOuput, studentCourseOutput, studentGradeOutput, deleteBtn)
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList() {
      renderStudentOnDom()
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage() {}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage() {}

function deleteStudentFromList() {

}