<?php

require_once('../config/mysql_connect.php');

$browser_id = $_POST['browserId'];

$output=[];

$query = "SELECT id, item_name as itemName, expense_category as expenseCategory, transaction_date as transactionDate, amount_spent as amountSpent FROM items WHERE browser_id = '$browser_id' ";

$result = mysqli_query($conn, $query);

if(mysqli_num_rows($result) > 0){
    $output['success'] = true;
    while($row = mysqli_fetch_assoc($result)){
        $output['data'][] = $row;
    }
} else {
    $output['success'] = false;
    $output['error'] = 'Invalid search. No data available.';
;}

?>