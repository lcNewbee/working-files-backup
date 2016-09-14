<?php
// 引用response.php
require_once ('./response.php');
$arr=array(
    'username'=>'',
    'password'=>''
);
Response::json(2000,'OK',$arr);
?>
