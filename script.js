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
      clearWarningMessageForitemName();
      clearWarningMessageForStudentCourse();
      clearWarningMessageForamountSpent()
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddExpenseFormInputs, updateItemList
 */

function validateAndAddStudent() {
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
      if (!ItemVal.transactionDate) {
            showWarningMessageForTransactionDate();
      }
      if (conditionForLetter && !ItemVal.expenseCategory) {
            $("#itemName").val("");
            $('select').prop('selectedIndex', 0)
            showWarningMessageForitemName();
            showWarningMessageForStudentCourse();
            if (!ItemVal.amountSpent || isNaN(ItemVal.amountSpent) || parseInt(ItemVal.amountSpent) < 0) {
                  $("#amountSpent").val("");
                  showWarningMessageForamountSpent();
            }
            return;
      } else if ((conditionForLetter && !ItemVal.amountSpent) || (conditionForLetter && isNaN(ItemVal.amountSpent)) || (conditionForLetter && parseInt(ItemVal.amountSpent) < 0) || (conditionForLetter)) {
            $("#itemName").val("");
            $("#amountSpent").val("");
            showWarningMessageForitemName();
            showWarningMessageForamountSpent();
            if (ItemVal.expenseCategory.length < 1) {
                  $('select').prop('selectedIndex', 0)
                  showWarningMessageForStudentCourse();
            }
            return;
      } else if ((!ItemVal.expenseCategory && !ItemVal.amountSpent) || (!ItemVal.expenseCategory && isNaN(ItemVal.amountSpent)) || (!ItemVal.expenseCategory && parseInt(ItemVal.amountSpent) < 0) || (!ItemVal.expenseCategory)) {
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
      } else if (!ItemVal.amountSpent || isNaN(ItemVal.amountSpent) || parseInt(ItemVal.amountSpent) < 0) {
            $("#amountSpent").val("");
            showWarningMessageForamountSpent();
            return;
      }
      itemArray.push(ItemVal); //push to global item array
      updateItemList();
      clearAddExpenseFormInputs();
      sendDataToServer();
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
            class: "updateBtn btn btn-update",
            text: "Update"
      });
      (function () {
            updateBtn.click(function () {
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
                              // itemArray.splice(indexOfCurrentStudent, 1);
                              // newTr.remove();
                              // renderExpenseTotal();
                              updateDataToServer(studentID);
                              console.log("Item clicked:", studentID);
                              // console.log("Item that was updated:", lastObjInitemArray.itemName);
                        });
                  })();
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
                              // console.log("Item that was deleted:", lastObjInitemArray.itemName);
                        });
                  })();
                  $('.modal-delete').modal('show');
            })
      })();
      var btnContainer = $("<td>", { class: 'btnContainer' }).append(updateBtn, deleteBtn);
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
                  } else {
                        $(".update-item-error").removeClass('hidden');
                  }
            },
            error: function (serverResponse) {
                  $(".update-item-error").removeClass('hidden');
                  // console.log('There was en error trying to update the item. Please try again')
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
      });
      $("#expenseCategory").focusin(function () {
            clearWarningMessageForStudentCourse();
      });
      $("#transactionDate").focusin(function () {
            clearWarningMessageForTransactionDate();
      })
      $("#amountSpent").focusin(function () {
            clearWarningMessageForamountSpent();
      });
      $("#itemNameUpdate, #expenseCategoryUpdate, #transactionDateUpdate, #amountSpentUpdate").focusin(function () {
            clearUpdateError();
      });
}

function showWarningMessageForitemName() {
      // $(".glyphicon-tag").closest('.input-group-addon').addClass('backgroundAndTextRed borderRed');
      $(".glyphicon-tag").closest('.input-group-addon').closest('.input-group').addClass('has-error');
      // $("#itemName").addClass('borderRed');
      $("#itemName").closest('.form-group').next('.warningText').removeClass('hidden');
}

function showWarningMessageForStudentCourse() {
      // $(".glyphicon-list-alt").closest('.input-group-addon').addClass('backgroundAndTextRed borderRed');
      $(".glyphicon-list-alt").closest('.input-group-addon').closest('.input-group').addClass('has-error');
      // $("#expenseCategory").addClass('borderRed');
      $("#expenseCategory").closest('.form-group').next('.warningText').removeClass('hidden');
}

function showWarningMessageForTransactionDate() {
      // $(".glyphicon-calendar").closest('.input-group-addon').addClass('backgroundAndTextRed borderRed');
      $(".glyphicon-calendar").closest('.input-group-addon').closest('.input-group').addClass('has-error');
      // $("#transactionDate").addClass('borderRed');
      $("#transactionDate").closest('.form-group').next('.warningText').removeClass('hidden');
}

function showWarningMessageForamountSpent() {
      // $(".glyphicon-usd").closest('.input-group-addon').addClass('backgroundAndTextRed borderRed');
      $(".glyphicon-usd").closest('.input-group-addon').closest('.input-group').addClass('has-error');
      // $("#amountSpent").addClass('borderRed');
      $("#amountSpent").closest('.form-group').next('.warningText').removeClass('hidden');
}

function clearWarningMessageForitemName() {
      // $(".glyphicon-tag").closest('.input-group-addon').removeClass('backgroundAndTextRed borderRed');
      $(".glyphicon-tag").closest('.input-group-addon').closest('.input-group').removeClass('has-error');
      // $("#itemName").removeClass('borderRed');
      $("#itemName").closest('.form-group').next('.warningText').addClass('hidden');
      if (!$(".add-item-error").hasClass('hidden')) {
            $(".add-item-error").addClass('hidden');
      }
}

function clearWarningMessageForStudentCourse() {
      // $(".glyphicon-list-alt").closest('.input-group-addon').removeClass('backgroundAndTextRed borderRed');
      $(".glyphicon-list-alt").closest('.input-group-addon').closest('.input-group').removeClass('has-error');
      // $("#expenseCategory").removeClass('borderRed');
      $("#expenseCategory").closest('.form-group').next('.warningText').addClass('hidden');
      if (!$(".add-item-error").hasClass('hidden')) {
            $(".add-item-error").addClass('hidden');
      }
}

function clearWarningMessageForTransactionDate() {
      // $(".glyphicon-calendar").closest('.input-group-addon').removeClass('backgroundAndTextRed borderRed');
      $(".glyphicon-calendar").closest('.input-group-addon').closest('.input-group').removeClass('has-error');
      // $("#transactionDate").removeClass('borderRed');
      $("#transactionDate").closest('.form-group').next('.warningText').addClass('hidden');
      if (!$(".add-item-error").hasClass('hidden')) {
            $(".add-item-error").addClass('hidden');
      }
}

function clearWarningMessageForamountSpent() {
      // $(".glyphicon-usd").closest('.input-group-addon').removeClass('backgroundAndTextRed borderRed');
      $(".glyphicon-usd").closest('.input-group-addon').closest('.input-group').removeClass('has-error');
      // $("#amountSpent").removeClass('borderRed');
      $("#amountSpent").closest('.form-group').next('.warningText').addClass('hidden');
      if (!$(".add-item-error").hasClass('hidden')) {
            $(".add-item-error").addClass('hidden');
      }
}

function clearUpdateError() {
      if (!$(".update-item-error").hasClass('hidden')) {
            $(".update-item-error").addClass('hidden');
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