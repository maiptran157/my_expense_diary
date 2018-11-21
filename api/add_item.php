<?php

require_once('../config/mysql_connect.php');
$item_name = $_POST['itemName'];
$expense_category = $_POST['expenseCategory'];
$transaction_date = $_POST['transactionDate'];
$amount_spent = $_POST['amountSpent'];

// print($item_name);

    $addItemQuery = "INSERT INTO `items` (`id`, `item_name`, `expense_category`, `transaction_date`, `amount_spent`) VALUES (NULL, '{$item_name}', '{$expense_category}', '{$transaction_date}', '{$amount_spent}');";

mysqli_query($conn, $addItemQuery);

// print($addItemQuery);
// exit();

$query = "SELECT DISTINCT * 
          FROM items 
          WHERE item_name = '$item_name'
          AND expense_category = '$expense_category'
          AND transaction_date = '$transaction_date'
          AND amount_spent = '$amount_spent'
          ";

// print($query);
// exit();
$result = mysqli_query($conn, $query);

$output=[];

if(mysqli_num_rows($result) > 0){
    $output['success'] = true;
    $output['message'] = 'Data was added successfully';
    while($row = mysqli_fetch_assoc($result)){
        $output['data'][] = $row;
    }
} else {
    $output['success'] = false;
    $output['message'] = 'There was an error trying to add the data. Please try again';
}

?>