<?php
// 引用response.php
require_once ('./response.php');
$arr1=array(
    "code"=>2000,
    "msg"=>"OK"
);
Responsestate::json($arr1);
?>
