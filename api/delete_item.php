<?php

require_once('../config/mysql_connect.php');
$item_id = $_POST['itemID'];
$browser_id = $_POST['browserId'];

$deleteItemQuery = "DELETE FROM `items` 
WHERE `items`.`id` = '{$item_id}'
AND browser_id = '{$browser_id}' 
";

// exit();
mysqli_query($conn, $deleteItemQuery);

$query = "SELECT DISTINCT * 
          FROM items 
          WHERE id = '$item_id'
          AND browser_id = '$browser_id' 
          ";

$result = mysqli_query($conn, $query);

$output=[];

if(mysqli_num_rows($result) > 0) {
    $output['success'] = false;
    $output['message'] = 'There was an error trying to delete the data. Please try again';
} else {
    $output['success'] = true;
    $output['message'] = 'Data was deleted successfully';
}

// $output = json_encode($output);

?>