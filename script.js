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
var itemArray = [];
/***************************************************************************************************
 * initializeApp 
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, including adding click handlers and pulling in any data from the server, in later versions
 */
function initializeApp() {
      getDataFromServer();
      addClickHandlersToElements();
      renderOptionOfCategoriesOnDOM();
      handleFocusInForForm();
}

/***************************************************************************************************
 * addClickHandlerstoElements
 * @params {undefined} 
 * @returns  {undefined}
 *     
 */
function addClickHandlersToElements() {
      $(".addItem").click(handleAddClicked);
      $(".cancelItem").click(handleCancelClick);
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
      clearWarningMessageForitemName();
      clearWarningMessageForStudentCourse();
      clearWarningMessageForamountSpent()
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */

function addStudent() {
      var ItemVal = {}; //local student object
      ItemVal.itemName = $("#itemName").val();
      ItemVal.expenseCategory = $("#expenseCategory option:selected").val();
      ItemVal.transactionDate = $("#transactionDate").val();
      ItemVal.amountSpent = $("#amountSpent").val();
      //check if input contains alphabetical letters and length is greater than 2
      var isLetter = /^[a-zA-Z]+$/.test(ItemVal.itemName);
      var isGreaterThan1Char = /[a-z]{2,}/gi.test(ItemVal.itemName);
      var conditionForLetter = (!isLetter && !isGreaterThan1Char)
      //debugger;
      if (conditionForLetter && !ItemVal.expenseCategory) {
            $("#itemName").val("");
            $('select').prop('selectedIndex', 0)
            showWarningMessageForitemName();
            showWarningMessageForStudentCourse();
            if (!ItemVal.amountSpent || isNaN(ItemVal.amountSpent) || parseInt(ItemVal.amountSpent) < 0 || parseInt(ItemVal.amountSpent) > 100) {
                  $("#amountSpent").val("");
                  showWarningMessageForamountSpent();
            }
            return;
      } else if ((conditionForLetter && !ItemVal.amountSpent) || (conditionForLetter && isNaN(ItemVal.amountSpent)) || (conditionForLetter && parseInt(ItemVal.amountSpent) < 0) || (conditionForLetter && parseInt(ItemVal.amountSpent) > 100)) {
            $("#itemName").val("");
            $("#amountSpent").val("");
            showWarningMessageForitemName();
            showWarningMessageForamountSpent();
            if (ItemVal.expenseCategory.length < 1) {
                  $('select').prop('selectedIndex', 0)
                  showWarningMessageForStudentCourse();
            }
            return;
      } else if ((!ItemVal.expenseCategory && !ItemVal.amountSpent) || (!ItemVal.expenseCategory && isNaN(ItemVal.amountSpent)) || (!ItemVal.expenseCategory && parseInt(ItemVal.amountSpent) < 0) || (!ItemVal.expenseCategory && parseInt(ItemVal.amountSpent) > 100)) {
            $('select').prop('selectedIndex', 0);
            $("#amountSpent").val("");
            showWarningMessageForStudentCourse();
            showWarningMessageForamountSpent();
            if (conditionForLetter) {
                  $("#itemName").val("");
                  showWarningMessageForitemName();
            }
            return;
      } else if (conditionForLetter) {
            $("#itemName").val("");
            showWarningMessageForitemName();
            return;
      } else if (!ItemVal.expenseCategory) {
            $('select').prop('selectedIndex', 0);
            showWarningMessageForStudentCourse();
            return;
      } else if (!ItemVal.amountSpent || isNaN(ItemVal.amountSpent) || parseInt(ItemVal.amountSpent) < 0 || parseInt(ItemVal.amountSpent) > 100) {
            $("#amountSpent").val("");
            showWarningMessageForamountSpent();
            return;
      }
      itemArray.push(ItemVal); //push to global student array
      updateStudentList();
      clearAddStudentFormInputs();
      sendDataToServer();
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs() {
      $("#itemName").val("");
      $('select').prop('selectedIndex', 0);
      $("#transactionDate").val("");
      $("#amountSpent").val("");
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom() {
      var lastObjInitemArray = itemArray[itemArray.length - 1];
      var newTr = $("<tr>", {
            class: "well"
      });
      var itemNameOuput = $("<td>", {
            class: "itemNameOuput",
            text: lastObjInitemArray.itemName
      });
      var studentCourseOutput = $("<td>", {
            class: "studentCourseOutput",
            text: lastObjInitemArray.expenseCategory
      });
      var transactionDateOutput = $("<td>", {
            class: "transactionDateOutput",
            text: lastObjInitemArray.transactionDate
      });
      var amountSpentOutput = $("<td>", {
            class: "amountSpentOutput",
            text: '$' + lastObjInitemArray.amountSpent
      });
      var updateBtn = $("<button>", {
            type: "button",
            class: "updateBtn btn btn-update",
            text: "Update"
      });
      (function () {
            updateBtn.click(function () {
                  var indexOfCurrentStudent = itemArray.indexOf(lastObjInitemArray);
                  var studentID = lastObjInitemArray.id;
                  $('.modal-title').text('Update this expense');
                  $('.modal-body .modal-item-name').text(`Item Name: ${lastObjInitemArray.itemName}`);
                  $('.modal-body .modal-expense-category').text(`Expense Category: ${lastObjInitemArray.expenseCategory}`);
                  $('.modal-body .modal-transaction-date').text(`Transaction Date: ${lastObjInitemArray.transactionDate}`);
                  $('.modal-body .modal-amount-spent').text(`Amount Spent: $${lastObjInitemArray.amountSpent}`);
                  // (function () {
                  //       $('.modal-delete-btn').click(function () {
                  //             itemArray.splice(indexOfCurrentStudent, 1);
                  //             newTr.remove();
                  //             renderGradeAverage();
                  //             deleteStudentFromDatabase(studentID);
                  //             console.log("Item that was deleted:", lastObjInitemArray.itemName);
                  //       });
                  // })();
                  $('.modal-update').modal('show');
            })
      })();
      var deleteBtn = $("<button>", {
            type: "button",
            class: "deleteBtn btn btn-danger",
            text: "Delete"
      });
      (function () {
            deleteBtn.click(function () {
                  var indexOfCurrentStudent = itemArray.indexOf(lastObjInitemArray);
                  var studentID = lastObjInitemArray.id;
                  $('.modal-title').text('Are you sure you want to delete this expense?');
                  $('.modal-body .modal-item-name').text(`Item Name: ${lastObjInitemArray.itemName}`);
                  $('.modal-body .modal-expense-category').text(`Expense Category: ${lastObjInitemArray.expenseCategory}`);
                  $('.modal-body .modal-transaction-date').text(`Transaction Date: ${lastObjInitemArray.transactionDate}`);
                  $('.modal-body .modal-amount-spent').text(`Amount Spent: $${lastObjInitemArray.amountSpent}`);
                  (function () {
                        $('.modal-delete-btn').click(function () {
                              itemArray.splice(indexOfCurrentStudent, 1);
                              newTr.remove();
                              renderGradeAverage();
                              deleteStudentFromDatabase(studentID);
                              console.log("Item that was deleted:", lastObjInitemArray.itemName);
                        });
                  })();
                  $('.modal-delete').modal('show');
            })
      })();
      var btnContainer = $("<td>").append(updateBtn, deleteBtn);
      $(".item-list tbody").append(newTr);
      newTr.append(itemNameOuput, studentCourseOutput, transactionDateOutput, amountSpentOutput, btnContainer);
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
      for (var itemArrayIndex = 0; itemArrayIndex < itemArray.length; itemArrayIndex++) {
            totalGrade += parseInt(itemArray[itemArrayIndex].grade);
      };
      gradeAverage = totalGrade / (itemArray.length);
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
            url: api_url.get_items_url,
            dataType: 'JSON',
            method: 'GET',
            success: function (serverResponse) {
                  var result = {};
                  result = serverResponse;
                  if (result.success) {
                        for (var i = 0; i < result.data.length; i++) {
                              itemArray.push(result.data[i]);
                              updateStudentList();
                        };
                  };
            }
      });
}

var categories = ['Grocery', 'Home Repairs', 'Mortgage/Rent', 'Clothes', 'Electronics', 'Home Appliances', 'Furniture', 'Entertainment', 'Dinning Out']

function renderOptionOfCategoriesOnDOM() {
      for (var i = 0; i < categories.length; i++) {
            var optionOfCourse = $("<option>", {
                  value: categories[i],
                  text: categories[i]
            })
            $('#expenseCategory').append(optionOfCourse);
      }
}

function sendDataToServer() {
      var lastObjInitemArray = itemArray[itemArray.length - 1];
      $.ajax({
            dataType: 'JSON',
            data: {
                  itemName: lastObjInitemArray.itemName,
                  expenseCategory: lastObjInitemArray.expenseCategory,
                  transactionDate: lastObjInitemArray.transactionDate,
                  amountSpent: lastObjInitemArray.amountSpent,
            },
            method: 'POST',
            url: api_url.add_item_url,
            success: function (serverResponse) {
                  var result = serverResponse;
                  if (result.success) {
                        lastObjInitemArray.id = result.data[result.data.length - 1].id;
                  }
            },
            error: function (serverResponse) {
                  $(".add-item-error").removeClass('hidden')
            }
      })
}

function deleteStudentFromDatabase(idOfStudentToBeDeleted) {
      var studentID = idOfStudentToBeDeleted;
      $.ajax({
            method: 'POST',
            data: {
                  itemID: studentID,
            },
            url: api_url.delete_item_url,
            success: function (serverResponse) {
                  var result = serverResponse;
                  if (result.success) {
                        console.log(result.message);
                  };
            },
      });
}

//handle focusin for form

function handleFocusInForForm() {
      $("#itemName").focusin(function () {
            clearWarningMessageForitemName();
      })
      $("#expenseCategory").focusin(function () {
            clearWarningMessageForStudentCourse();
      })
      $("#amountSpent").focusin(function () {
            clearWarningMessageForamountSpent();
      })
}

function showWarningMessageForitemName() {
      $(".glyphicon-tag").closest('.input-group-addon').addClass('backgroundAndTextRed borderRed');
      $("#itemName").addClass('borderRed');
      $("#itemName").closest('.form-group').next('.warningText').removeClass('hidden');
}

function showWarningMessageForStudentCourse() {
      $(".glyphicon-list-alt").closest('.input-group-addon').addClass('backgroundAndTextRed borderRed');
      $("#expenseCategory").addClass('borderRed');
      $("#expenseCategory").closest('.form-group').next('.warningText').removeClass('hidden');
}

function showWarningMessageForamountSpent() {
      $(".glyphicon-usd").closest('.input-group-addon').addClass('backgroundAndTextRed borderRed');
      $("#amountSpent").addClass('borderRed');
      $("#amountSpent").closest('.form-group').next('.warningText').removeClass('hidden');
}

function clearWarningMessageForitemName() {
      $(".glyphicon-tag").closest('.input-group-addon').removeClass('backgroundAndTextRed borderRed');
      $("#itemName").removeClass('borderRed');
      $("#itemName").closest('.form-group').next('.warningText').addClass('hidden');
      if (!$(".add-item-error").hasClass('hidden')) {
            $(".add-item-error").addClass('hidden');
      }
}

function clearWarningMessageForStudentCourse() {
      $(".glyphicon-list-alt").closest('.input-group-addon').removeClass('backgroundAndTextRed borderRed');
      $("#expenseCategory").removeClass('borderRed');
      $("#expenseCategory").closest('.form-group').next('.warningText').addClass('hidden');
      if (!$(".add-item-error").hasClass('hidden')) {
            $(".add-item-error").addClass('hidden');
      }
}

function clearWarningMessageForamountSpent() {
      $(".glyphicon-usd").closest('.input-group-addon').removeClass('backgroundAndTextRed borderRed');
      $("#amountSpent").removeClass('borderRed');
      $("#amountSpent").closest('.form-group').next('.warningText').addClass('hidden');
      if (!$(".add-item-error").hasClass('hidden')) {
            $(".add-item-error").addClass('hidden');
      }
}