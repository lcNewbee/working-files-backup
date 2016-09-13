<?php
// 引用response.php
require_once ('./response.php');
$arr=array(
    'userType'=>0,
    'userName'=>'神器',
    'userPassword'=>'',
    'purview'=>'192.168.5.53'
);
Response::json(2000,'OK',$arr);
?>
