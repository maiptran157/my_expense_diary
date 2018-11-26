<?php

require_once('../config/mysql_connect.php');
$item_id = $_POST['itemID'];
$item_name = $_POST['itemName'];
$expense_category = $_POST['expenseCategory'];
$transaction_date = $_POST['transactionDate'];
$amount_spent = $_POST['amountSpent'];

$updateItemQuery = "UPDATE `items` SET `item_name` = '{$item_name}', `expense_category` = '{$expense_category}', `transaction_date` = '{$transaction_date}', `amount_spent` = '{$amount_spent}' WHERE `items`.`id` = '{$item_id}'";

// print($updateItemQuery);
// exit();

mysqli_query($conn, $updateItemQuery);

$query = "SELECT DISTINCT * 
          FROM items 
          WHERE id = '$item_id'
          AND item_name = '$item_name'
          AND expense_category = '$expense_category'
          AND transaction_date = '$transaction_date'
          AND amount_spent = '$amount_spent'
          ";

$result = mysqli_query($conn, $query);

$output=[];

if(mysqli_num_rows($result) > 0) {
    $output['success'] = true;
    $output['message'] = 'Data was updated successfully';
} else {
    $output['success'] = false;
    $output['message'] = 'There was an error trying to update the data. Please try again';
}

// $output = json_encode($output);

?>