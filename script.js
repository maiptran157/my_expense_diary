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
 * itemArray - global array to hold item objects
 * @type {Array}
 * example of itemArray after input: 
 * itemArray = [
 *  { amountSpent: "4.00", expenseCategory: "Dining Out", id: "1", itemName: "Thai Tea", transactionDate: "2018-11-20" },
 *  { amountSpent: "4.00", expenseCategory: "Dining Out", id: "2", itemName: "Thai Tea", transactionDate: "2018-11-20" }
 * ];
 * today - global string to hold today date, month, year, etc.
 * @type {String}
 * dd - global string to hold today date of the month
 * @type {String}
 * mm - global string to hold today month
 * @type {String}
 * yyyy - global string to hold current year
 * @type {String}
 * todayDate - global string to hold today date in yyyy-mm-dd format
 * @type {String}
 * categories - global array to hold options for expense category
 * @type {Array}
 */
var itemArray = [];
var today = null;
var dd = null;
var mm = null;
var yyyy = null;
var todayDate = getTodayDate();
var categories = ['Grocery', 'Home Repairs', 'Mortgage/Rent', 'Beauty', 'Clothes', 'Electronics', 'Home Appliances', 'Home Goods', 'Furniture', 'Entertainment', 'Dining Out', 'Other']

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
 * renderOptionOfCategoriesOnDOM - display options for expense category on DOM
 * @returns {undefined} none
 */
function renderOptionOfCategoriesOnDOM() {
      for (var i = 0; i < categories.length; i++) {
            var optionOfCourse = $("<option>", {
                  value: categories[i],
                  text: categories[i]
            })
            $('#expenseCategory, #expenseCategoryUpdate').append(optionOfCourse);
      }
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
 * @return: 
       none
 */
function handleAddClicked() {
      validateAndAddItem();
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out item form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddExpenseFormInputs, clearSuccessMessage, clearWarningMessageForitemName, clearWarningMessageForItemCategory, clearWarningMessageForTransactionDate, clearWarningMessageForamountSpent
 */
function handleCancelClick() {
      clearAddExpenseFormInputs();
      clearSuccessMessage();
      clearWarningMessageForitemName();
      clearWarningMessageForItemCategory();
      clearWarningMessageForTransactionDate();
      clearWarningMessageForamountSpent();
      isValidated = false;
}
/***************************************************************************************************
 * validateAndAddItem - creates a ItemVal objects based on input fields in the form and adds the object to global itemArray array
 * @param {boolean} isValidated
 * @return undefined
 * @calls showWarningMessageForTransactionDate, showSuccessMessageForTransactionDate, showWarningMessageForitemName, showSuccessMessageForitemName, 
 * showWarningMessageForItemCategory, showSuccessMessageForItemCategory, showWarningMessageForamountSpent, showSuccessMessageForamountSpent,
 * updateItemList, clearAddExpenseFormInputs, clearSuccessMessage, sendDataToServer
 */

function validateAndAddItem(isValidated = false) {
      var ItemVal = {}; //local item object
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
 * clearAddExpenseFormInputs - clears out the form values
 */
function clearAddExpenseFormInputs() {
      $("#itemName").val("");
      $('select').prop('selectedIndex', 0);
      $("#transactionDate").val("");
      $("#amountSpent").val("");
}
/***************************************************************************************************
 * renderItemOnDom - take in a item object, create html elements from the values and then append the elements
 * into the .item_list tbody
 * @param {object} lastObjInitemArray a single item object with itemName, expenseCategory, transactionDate, and amountSpent inside
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
      var expenseCategoryOutput = $("<td>", {
            class: "expenseCategoryOutput",
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
                                    var indexOfCurrentItem = itemArray.indexOf(lastObjInitemArray);
                                    var itemID = lastObjInitemArray.id;
                                    updateDataToServer(itemID);
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
                                    var indexOfCurrentItem = itemArray.indexOf(lastObjInitemArray);
                                    var itemID = lastObjInitemArray.id;
                                    deleteItemFromDatabase(itemID, indexOfCurrentItem, newTr);
                              });
                        })();
                        $('.modal-delete').modal('show');
                  })
            })();
      }
      var btnContainer = $("<td>", { class: 'btnContainer' }).append(updateBtn, updateBtnGlyphicon, deleteBtn, deleteBtnGlyphicon);
      $(".item-list tbody").append(newTr);
      newTr.append(itemNameOuput, expenseCategoryOutput, transactionDateOutput, amountSpentOutput, btnContainer);
}

/***************************************************************************************************
 * updateItemList - centralized function to update the total and call item list update
 * @param items {array} the array of item objects
 * @returns {undefined} none
 * @calls renderItemOnDom, calculateExpenseTotal, renderExpenseTotal
 */
function updateItemList() {
      renderItemOnDom();
      calculateExpenseTotal();
      renderExpenseTotal();
}
/***************************************************************************************************
 * calculateExpenseTotal - loop through the global item array and calculate total expense based on date that falls in current month and year, and return that value
 * @param: {array} items  the array of item objects
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
 * renderExpenseTotal - updates the on-page total expense
 * @returns {undefined} none
 */
function renderExpenseTotal() {
      var currentMonthExpense = calculateExpenseTotal();
      $(".currentMonthExpense").text(`$${currentMonthExpense}`);
}
/***************************************************************************************************
 * getDataFromServer - get item from server
 * @returns {undefined} none
 * @calls updateItemList
 */
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

/***************************************************************************************************
 * updateItemList - centralized function to update the total and call item list update
 * @param items {array} the array of item objects
 * @returns {undefined} none
 * @calls renderItemOnDom, calculateExpenseTotal, renderExpenseTotal
 */
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
/***************************************************************************************************
 * updateDataToServer - update the item with specific id in the database
 * @param idOfItemToBeUpdated {string} the id of item to be updated
 * @returns {undefined} none
 * @calls getDataFromServer, renderExpenseTotal
 */
function updateDataToServer(idOfItemToBeUpdated) {
      var ItemVal = {}; //local item object
      ItemVal.itemName = $("#itemNameUpdate").val();
      ItemVal.expenseCategory = $("#expenseCategoryUpdate option:selected").val();
      ItemVal.transactionDate = $("#transactionDateUpdate").val();
      ItemVal.amountSpent = $("#amountSpentUpdate").val();
      $.ajax({
            dataType: 'JSON',
            data: {
                  itemID: idOfItemToBeUpdated,
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
                              if (itemArray[i].id === idOfItemToBeUpdated) {
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
/***************************************************************************************************
 * deleteItemFromDatabase - delete item from database
 * @param idOfItemToBeDeleted {string} id of item to be deleted
 * @param indexOfCurrentItem {number} index of item to be removed from itemArray
 * @param newTr {string} element to be removed from DOM
 * @returns {undefined} none
 */
function deleteItemFromDatabase(idOfItemToBeDeleted, indexOfCurrentItem, newTr) {
      var itemID = idOfItemToBeDeleted;
      $.ajax({
            method: 'POST',
            data: {
                  itemID: itemID,
            },
            url: api_url.delete_item_url,
            success: function (serverResponse) {
                  var result = serverResponse;
                  if (result.success) {
                        itemArray.splice(indexOfCurrentItem, 1);
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

/***************************************************************************************************
 * handleFocusInForForm - clear out messages when input form is focused
 * @returns {undefined} none
 * @calls clearWarningMessageForitemName, clearSuccessMessage, clearWarningMessageForItemCategory,
 * clearWarningMessageForTransactionDate, clearWarningMessageForamountSpent, clearUpdateError
 */
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
/***************************************************************************************************
 * showWarningMessageForitemName, showWarningMessageForItemCategory,
 * showWarningMessageForTransactionDate, showWarningMessageForamountSpent - show warning message for certain input field
 * @returns {undefined} none
 */
function showWarningMessageForitemName() {
      $(".itemNameContainer").addClass('has-error');
      $('.itemWarningText').removeClass('hidden');
      $("#itemName").next('.glyphicon-remove').removeClass('hidden');
}

function showWarningMessageForItemCategory() {
      $(".expenseCategoryContainer").addClass('has-error');
      $('.categoryWarningText').removeClass('hidden');
      $("#expenseCategory").next('.glyphicon-remove').removeClass('hidden');
}

function showWarningMessageForTransactionDate() {
      $(".transactionDateContainer").addClass('has-error');
      $('.dateWarningText').removeClass('hidden');
      $("#transactionDate").next('.glyphicon-remove').removeClass('hidden');
}

function showWarningMessageForamountSpent() {
      $(".amountSpentContainer").addClass('has-error');
      $('.amountWarningText').removeClass('hidden');
      $("#amountSpent").next('.glyphicon-remove').removeClass('hidden');
}
/***************************************************************************************************
 * showSuccessMessageForitemName, showSuccessMessageForItemCategory,
 * showSuccessMessageForTransactionDate, showSuccessMessageForamountSpent - show success message for certain input field
 * @returns {undefined} none
 */
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
/***************************************************************************************************
 * clearWarningMessageForitemName, clearWarningMessageForItemCategory,
 * clearWarningMessageForTransactionDate, clearWarningMessageForamountSpent - clear warning message for certain input field
 * @returns {undefined} none
 */
function clearWarningMessageForitemName() {
      $(".itemNameContainer").removeClass('has-error');
      $('.itemWarningText').addClass('hidden');
      $("#itemName").next('.glyphicon-remove').addClass('hidden');
      clearAddError()
}

function clearWarningMessageForItemCategory() {
      $(".expenseCategoryContainer").removeClass('has-error');
      $('.categoryWarningText').addClass('hidden');
      $("#expenseCategory").next('.glyphicon-remove').addClass('hidden');
      clearAddError()
}

function clearWarningMessageForTransactionDate() {
      $(".transactionDateContainer").removeClass('has-error');
      $('.dateWarningText').addClass('hidden');
      $("#transactionDate").next('.glyphicon-remove').addClass('hidden');
      clearAddError()
}

function clearWarningMessageForamountSpent() {
      $(".amountSpentContainer").removeClass('has-error');
      $('.amountWarningText').addClass('hidden');
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
/***************************************************************************************************
 * clearSuccessMessage - clear success message for certain input field
 * @returns {undefined} none
 */
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
/***************************************************************************************************
 * clearUpdateError - clear update error
 * @returns {undefined} none
 */
function clearUpdateError() {
      if (!$(".update-item-error").hasClass('hidden')) {
            $(".update-item-error").addClass('hidden');
      }
}
/***************************************************************************************************
 * clearAddError - clear add error
 * @returns {undefined} none
 */
function clearAddError() {
      if (!$(".add-item-error").hasClass('hidden')) {
            $(".add-item-error").addClass('hidden');
      }
}
/***************************************************************************************************
 * getTodayDate - get today date and update global variables today, dd, mm, yyyy, todayDate
 * @returns {string} 
 */
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