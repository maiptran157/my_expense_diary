<?php

require_once('../config/mysql_connect.php');

$output=[];

$query = "SELECT * FROM items";

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