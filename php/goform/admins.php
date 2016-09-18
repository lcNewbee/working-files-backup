<?php
// 引用response.php
require_once ('./response.php');
$arr1=array(
    "code"=>2000,
    "msg"=>"OK"
);
$arr2=array(
    'userType'=>0,
    'userName'=>'神器',
    'userPassword'=>'',
    'purview'=>'192.168.5.53'
);
Responsestatedata::json($arr1,$arr2);
?>
