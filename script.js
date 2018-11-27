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
var today = null;
var dd = null;
var mm = null;
var yyyy = null;
var todayDate = getTodayDate();

/***************************************************************************************************
 * initializeApp 
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, including adding click handlers and pulling in any data from the server, in later versions
 */
function initializeApp() {
      $(".todayDate").text(`Current date: ${todayDate}`);
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
      // $("#itemName, #expenseCategory, #transactionDate, #amountSpent").on("keyup", event => {
      //       if (event.keyCode === 13) {
      //             event.preventDefault();
      //             $(".addItem").click(handleAddClicked);
      //       }
      // });
      $(".cancelItem").click(handleCancelClick);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked() {
      validateAndAddStudent();
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddExpenseFormInputs
 */
function handleCancelClick() {
      clearAddExpenseFormInputs();
      clearSuccessMessage();
      clearWarningMessageForitemName();
      clearWarningMessageForItemCategory();
      clearWarningMessageForTransactionDate();
      clearWarningMessageForamountSpent()
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddExpenseFormInputs, updateItemList
 */

function validateAndAddStudent(isValidated = false) {
      var ItemVal = {}; //local student object
      ItemVal.itemName = $("#itemName").val();
      ItemVal.expenseCategory = $("#expenseCategory option:selected").val();
      ItemVal.transactionDate = $("#transactionDate").val();
      ItemVal.amountSpent = $("#amountSpent").val();
      //check if input contains alphabetical letters and length is greater than 2
      var isLetter = /^[a-zA-Z]+$/.test(ItemVal.itemName);
      var isGreaterThan1Char = /[a-z]{2,}/gi.test(ItemVal.itemName);
      var conditionForLetter = (!isLetter && !isGreaterThan1Char)

      if (!ItemVal.transactionDate) {
            showWarningMessageForTransactionDate();
      } else {
            showSuccessMessageForTransactionDate();
      }
      if (conditionForLetter || ItemVal.itemName.length > 20) {
            showWarningMessageForitemName();
      } else {
            showSuccessMessageForitemName();
      }
      if (!ItemVal.expenseCategory) {
            showWarningMessageForItemCategory();
      } else {
            showSuccessMessageForItemCategory();
      }
      if (parseFloat(ItemVal.amountSpent).toFixed(2) < 0.01 || !ItemVal.amountSpent) {
            showWarningMessageForamountSpent();
      } else {
            showSuccessMessageForamountSpent();
      }
      if (ItemVal.transactionDate) {
            if (!conditionForLetter) {
                  if (ItemVal.itemName.length <= 20) {
                        if (ItemVal.expenseCategory) {
                              if (parseFloat(ItemVal.amountSpent).toFixed(2) >= 0.01) {
                                    if (ItemVal.amountSpent) {
                                          isValidated = true;
                                    }
                              }
                        }
                  }
            }
      }
      if (isValidated) {
            itemArray.push(ItemVal); //push to global item array
            updateItemList();
            clearAddExpenseFormInputs();
            clearSuccessMessage();
            sendDataToServer();
      }
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddExpenseFormInputs() {
      $("#itemName").val("");
      $('select').prop('selectedIndex', 0);
      $("#transactionDate").val("");
      $("#amountSpent").val("");
}
/***************************************************************************************************
 * renderItemOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderItemOnDom() {
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
            class: "updateBtn btn btn-update update-btn-w-text",
            text: "Update"
      });
      var updateBtnGlyphicon = $("<button>", {
            type: "button",
            class: "updateBtn btn btn-update glyphicon glyphicon-pencil",
      });
      var updateBtnArray = [updateBtn, updateBtnGlyphicon];
      for (var i = 0; i < updateBtnArray.length; i++) {
            (function () {
                  updateBtnArray[i].click(function () {
                        if (!$('.update-item-error').hasClass('hidden')) {
                              $('.update-item-error').addClass('hidden')
                        }
                        $('#itemNameUpdate').val(lastObjInitemArray.itemName);
                        for (var i = 0; i < categories.length; i++) {
                              if (categories[i] === lastObjInitemArray.expenseCategory) {
                                    $('#expenseCategoryUpdate').prop('selectedIndex', i + 1)
                              }
                        }
                        $('#transactionDateUpdate').val(lastObjInitemArray.transactionDate);
                        $('#amountSpentUpdate').val(lastObjInitemArray.amountSpent);
                        (function () {
                              $('.modal-update-btn').off("click").click(function () {
                                    var indexOfCurrentStudent = itemArray.indexOf(lastObjInitemArray);
                                    var studentID = lastObjInitemArray.id;
                                    updateDataToServer(studentID);
                              });
                        })();
                        $('.modal-update').modal('show');
                  })
            })();
      }
      var deleteBtn = $("<button>", {
            type: "button",
            class: "deleteBtn btn btn-danger delete-btn-w-text",
            text: "Delete"
      });
      var deleteBtnGlyphicon = $("<button>", {
            type: "button",
            class: "deleteBtn btn btn-danger glyphicon glyphicon-trash",
      });
      var deleteBtnArray = [deleteBtn, deleteBtnGlyphicon];
      for (var i = 0; i < deleteBtnArray.length; i++) {
            (function () {
                  deleteBtnArray[i].click(function () {
                        if (!$('.delete-item-error').hasClass('hidden')) {
                              $('.delete-item-error').addClass('hidden')
                        }
                        $('.delete-body .modal-item-name').empty().append($("<label>", { text: "Item Name:" }), $("<span>", {
                              text: ` ${lastObjInitemArray.itemName}`
                        }));
                        $('.delete-body .modal-expense-category').empty().append($("<label>", { text: "Expense Category:" }), $("<span>", {
                              text: ` ${lastObjInitemArray.expenseCategory}`
                        }));
                        $('.delete-body .modal-transaction-date').empty().append($("<label>", { text: "Transaction Date:" }), $("<span>", {
                              text: ` ${lastObjInitemArray.transactionDate}`
                        }));
                        $('.delete-body .modal-amount-spent').empty().append($("<label>", { text: "Amount Spent:" }), $("<span>", {
                              text: ` $${lastObjInitemArray.amountSpent}`
                        }));
                        (function () {
                              $('.modal-delete-btn').off("click").click(function () {
                                    var indexOfCurrentStudent = itemArray.indexOf(lastObjInitemArray);
                                    var studentID = lastObjInitemArray.id;
                                    deleteStudentFromDatabase(studentID, indexOfCurrentStudent, newTr);
                              });
                        })();
                        $('.modal-delete').modal('show');
                  })
            })();
      }
      var btnContainer = $("<td>", { class: 'btnContainer' }).append(updateBtn, updateBtnGlyphicon, deleteBtn, deleteBtnGlyphicon);
      $(".item-list tbody").append(newTr);
      newTr.append(itemNameOuput, studentCourseOutput, transactionDateOutput, amountSpentOutput, btnContainer);
}

/***************************************************************************************************
 * updateItemList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderItemOnDom, calculateExpenseTotal, renderExpenseTotal
 */
function updateItemList() {
      renderItemOnDom();
      calculateExpenseTotal();
      renderExpenseTotal();
}
/***************************************************************************************************
 * calculateExpenseTotal - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateExpenseTotal() {
      var totalExpense = 0;
      for (var itemArrayIndex = 0; itemArrayIndex < itemArray.length; itemArrayIndex++) {
            if (itemArray[itemArrayIndex].transactionDate.substring(0, 4) == yyyy && itemArray[0].transactionDate.substring(5, 7) == mm) {
                  totalExpense += parseInt(itemArray[itemArrayIndex].amountSpent);
            }
      };
      return totalExpense;
}
/***************************************************************************************************
 * renderExpenseTotal - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderExpenseTotal() {
      var currentMonthExpense = calculateExpenseTotal();
      $(".currentMonthExpense").text(`$${currentMonthExpense}`);
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
                              updateItemList();
                        };
                  };
            }
      });
}

var categories = ['Grocery', 'Home Repairs', 'Mortgage/Rent', 'Beauty', 'Clothes', 'Electronics', 'Home Appliances', 'Home Goods', 'Furniture', 'Entertainment', 'Dining Out', 'Other']

function renderOptionOfCategoriesOnDOM() {
      for (var i = 0; i < categories.length; i++) {
            var optionOfCourse = $("<option>", {
                  value: categories[i],
                  text: categories[i]
            })
            $('#expenseCategory, #expenseCategoryUpdate').append(optionOfCourse);
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

function updateDataToServer(idOfStudentToBeUpdated) {
      var ItemVal = {}; //local item object
      ItemVal.itemName = $("#itemNameUpdate").val();
      ItemVal.expenseCategory = $("#expenseCategoryUpdate option:selected").val();
      ItemVal.transactionDate = $("#transactionDateUpdate").val();
      ItemVal.amountSpent = $("#amountSpentUpdate").val();
      $.ajax({
            dataType: 'JSON',
            data: {
                  itemID: idOfStudentToBeUpdated,
                  itemName: ItemVal.itemName,
                  expenseCategory: ItemVal.expenseCategory,
                  transactionDate: ItemVal.transactionDate,
                  amountSpent: ItemVal.amountSpent,
            },
            method: 'POST',
            url: api_url.update_item_url,
            success: function (serverResponse) {
                  var result = serverResponse;
                  if (result.success) {
                        for (var i = 0; i < itemArray.length; i++) {
                              if (itemArray[i].id === idOfStudentToBeUpdated) {
                                    itemArray[i].itemName = ItemVal.itemName;
                                    itemArray[i].expenseCategory = ItemVal.expenseCategory;
                                    itemArray[i].transactionDate = ItemVal.transactionDate;
                                    itemArray[i].amountSpent = ItemVal.amountSpent;
                              }
                        }
                        $(".modal-update").modal('hide');
                        $(".item-list tbody").empty();
                        getDataFromServer();
                        renderExpenseTotal();
                  } else {
                        $(".update-item-error").removeClass('hidden');
                  }
            },
            error: function (serverResponse) {
                  $(".update-item-error").removeClass('hidden');
            }
      })
}

function deleteStudentFromDatabase(idOfStudentToBeDeleted, indexOfCurrentStudent, newTr) {
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
                        itemArray.splice(indexOfCurrentStudent, 1);
                        newTr.remove();
                        renderExpenseTotal();
                        $(".modal-delete").modal('hide');
                  } else {
                        $(".delete-item-error").removeClass('hidden');
                  };
            },
            error: function () {
                  $(".delete-item-error").removeClass('hidden');
            }
      });
}

//handle focusin for form

function handleFocusInForForm() {
      $("#itemName").focusin(function () {
            clearWarningMessageForitemName();
            clearSuccessMessage();
      });
      $("#expenseCategory").focusin(function () {
            clearWarningMessageForItemCategory();
            clearSuccessMessage();
      });
      $("#transactionDate").focusin(function () {
            clearWarningMessageForTransactionDate();
            clearSuccessMessage();
      })
      $("#amountSpent").focusin(function () {
            clearWarningMessageForamountSpent();
            clearSuccessMessage();
      });
      $("#itemNameUpdate, #expenseCategoryUpdate, #transactionDateUpdate, #amountSpentUpdate").focusin(function () {
            clearUpdateError();
      });
}

function showWarningMessageForitemName() {
      $(".glyphicon-tag").closest('.input-group-addon').closest('.input-group').addClass('has-error');
      $("#itemName").closest('.form-group').next('.warningText').removeClass('hidden');
      $("#itemName").next('.glyphicon-remove').removeClass('hidden');
}

function showWarningMessageForItemCategory() {
      $(".glyphicon-list-alt").closest('.input-group-addon').closest('.input-group').addClass('has-error');
      $("#expenseCategory").closest('.form-group').next('.warningText').removeClass('hidden');
      $("#expenseCategory").next('.glyphicon-remove').removeClass('hidden');
}

function showWarningMessageForTransactionDate() {
      $(".glyphicon-calendar").closest('.input-group-addon').closest('.input-group').addClass('has-error');
      $("#transactionDate").closest('.form-group').next('.warningText').removeClass('hidden');
      $("#transactionDate").next('.glyphicon-remove').removeClass('hidden');
}

function showWarningMessageForamountSpent() {
      $(".glyphicon-usd").closest('.input-group-addon').closest('.input-group').addClass('has-error');
      $("#amountSpent").closest('.form-group').next('.warningText').removeClass('hidden');
      $("#amountSpent").next('.glyphicon-remove').removeClass('hidden');
}

function showSuccessMessageForitemName() {
      $(".glyphicon-tag").closest('.input-group-addon').closest('.input-group').addClass('has-success');
      $("#itemName").closest('.form-group').next('.warningText').next('.successText').removeClass('hidden');
      $("#itemName").next('.glyphicon-remove').next('.glyphicon-ok').removeClass('hidden');
}

function showSuccessMessageForItemCategory() {
      $(".glyphicon-list-alt").closest('.input-group-addon').closest('.input-group').addClass('has-success');
      $("#expenseCategory").closest('.form-group').next('.warningText').next('.successText').removeClass('hidden');
      $("#expenseCategory").next('.glyphicon-remove').next('.glyphicon-ok').removeClass('hidden');
}

function showSuccessMessageForTransactionDate() {
      $(".glyphicon-calendar").closest('.input-group-addon').closest('.input-group').addClass('has-success');
      $("#transactionDate").closest('.form-group').next('.warningText').next('.successText').removeClass('hidden');
      $("#transactionDate").next('.glyphicon-remove').next('.glyphicon-ok').removeClass('hidden');
}

function showSuccessMessageForamountSpent() {
      $(".glyphicon-usd").closest('.input-group-addon').closest('.input-group').addClass('has-success');
      $("#amountSpent").closest('.form-group').next('.warningText').next('.successText').removeClass('hidden');
      $("#amountSpent").next('.glyphicon-remove').next('.glyphicon-ok').removeClass('hidden');
}

function clearWarningMessageForitemName() {
      $(".glyphicon-tag").closest('.input-group-addon').closest('.input-group').removeClass('has-error');
      $("#itemName").closest('.form-group').next('.warningText').addClass('hidden');
      $("#itemName").next('.glyphicon-remove').addClass('hidden');
      clearAddError()
}

function clearWarningMessageForItemCategory() {
      $(".glyphicon-list-alt").closest('.input-group-addon').closest('.input-group').removeClass('has-error');
      $("#expenseCategory").closest('.form-group').next('.warningText').addClass('hidden');
      $("#expenseCategory").next('.glyphicon-remove').addClass('hidden');
      clearAddError()
}

function clearWarningMessageForTransactionDate() {
      $(".glyphicon-calendar").closest('.input-group-addon').closest('.input-group').removeClass('has-error');
      $("#transactionDate").closest('.form-group').next('.warningText').addClass('hidden');
      $("#transactionDate").next('.glyphicon-remove').addClass('hidden');
      clearAddError()
}

function clearWarningMessageForamountSpent() {
      $(".glyphicon-usd").closest('.input-group-addon').closest('.input-group').removeClass('has-error');
      $("#amountSpent").closest('.form-group').next('.warningText').addClass('hidden');
      $("#amountSpent").next('.glyphicon-remove').addClass('hidden');
      clearAddError()
}

// function clearSuccessMessageForitemName() {
//       $(".glyphicon-tag").closest('.input-group-addon').closest('.input-group').removeClass('has-success');
//       $("#itemName").closest('.form-group').next('.warningText').next('.successText').addClass('hidden');
//       $("#itemName").next('.glyphicon-remove').next('.glyphicon-ok').addClass('hidden');
// }

// function clearSuccessMessageForItemCategory() {
//       $(".glyphicon-list-alt").closest('.input-group-addon').closest('.input-group').removeClass('has-success');
//       $("#expenseCategory").closest('.form-group').next('.warningText').next('.successText').addClass('hidden');
//       $("#expenseCategory").next('.glyphicon-remove').next('.glyphicon-ok').addClass('hidden');
// }

// function clearSuccessMessageForTransactionDate() {
//       $(".glyphicon-calendar").closest('.input-group-addon').closest('.input-group').removeClass('has-success');
//       $("#transactionDate").closest('.form-group').next('.warningText').next('.successText').addClass('hidden');
//       $("#transactionDate").next('.glyphicon-remove').next('.glyphicon-ok').addClass('hidden');
// }

// function clearSuccessMessageForamountSpent() {
//       $(".glyphicon-usd").closest('.input-group-addon').closest('.input-group').removeClass('has-success');
//       $("#amountSpent").closest('.form-group').next('.warningText').next('.successText').addClass('hidden');
//       $("#amountSpent").next('.glyphicon-remove').next('.glyphicon-ok').addClass('hidden');
// }

function clearSuccessMessage() {
      $(".glyphicon-tag").closest('.input-group-addon').closest('.input-group').removeClass('has-success');
      $("#itemName").closest('.form-group').next('.warningText').next('.successText').addClass('hidden');
      $("#itemName").next('.glyphicon-remove').next('.glyphicon-ok').addClass('hidden');
      $(".glyphicon-list-alt").closest('.input-group-addon').closest('.input-group').removeClass('has-success');
      $("#expenseCategory").closest('.form-group').next('.warningText').next('.successText').addClass('hidden');
      $("#expenseCategory").next('.glyphicon-remove').next('.glyphicon-ok').addClass('hidden');
      $(".glyphicon-calendar").closest('.input-group-addon').closest('.input-group').removeClass('has-success');
      $("#transactionDate").closest('.form-group').next('.warningText').next('.successText').addClass('hidden');
      $("#transactionDate").next('.glyphicon-remove').next('.glyphicon-ok').addClass('hidden');
      $(".glyphicon-usd").closest('.input-group-addon').closest('.input-group').removeClass('has-success');
      $("#amountSpent").closest('.form-group').next('.warningText').next('.successText').addClass('hidden');
      $("#amountSpent").next('.glyphicon-remove').next('.glyphicon-ok').addClass('hidden');
}

function clearUpdateError() {
      if (!$(".update-item-error").hasClass('hidden')) {
            $(".update-item-error").addClass('hidden');
      }
}

function clearAddError() {
      if (!$(".add-item-error").hasClass('hidden')) {
            $(".add-item-error").addClass('hidden');
      }
}

function getTodayDate() {
      today = new Date();
      dd = today.getDate();
      mm = today.getMonth() + 1; //January is 0!
      yyyy = today.getFullYear();
      if (dd < 10) {
            dd = '0' + dd
      }
      if (mm < 10) {
            mm = '0' + mm
      }
      return `${yyyy}-${mm}-${dd}`;
}