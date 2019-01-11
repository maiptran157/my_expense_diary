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
} else if(mysqli_num_rows($result) === 0) {

    $item_name = 'Sample item';
    $expense_category = 'Sample category';
    $transaction_date = date('Y-m-d');
    $amount_spent = '1.00';

    $addSampleItemQuery = "INSERT INTO `items` 
    (`id`, `item_name`, `expense_category`, `transaction_date`, `amount_spent`, `browser_id`) 
    VALUES (NULL, '{$item_name}', '{$expense_category}', '{$transaction_date}', '{$amount_spent}', '{$browser_id}');";

    mysqli_query($conn, $addSampleItemQuery);

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
    }

} else {
    $output['success'] = false;
    $output['error'] = 'Invalid search. No data available.';
}

?>