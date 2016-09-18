<?php
require('./mysql.php');
require_once ('./response.php');
$username=$_REQUEST['username'];
$passwd=$_REQUEST['passwd']
session_start();
$_SESSION['s_username']=$username;
$query_user="select * from user where username = '$username' and passwd = '$passwd'";
$db=new mysql();//实例化类mysql
$result = $db->query_exec($query_user);//验证用户
$num_results=$result->num_rows;//取得数据库中的记录行
if($num_results==0)
{
$arr1=array(
    "code"=>2000,
    "msg"=>"用户名或密码错误"
);
$arr2=array(
    'a_165F8BA5ABE1A5DA'=>0
);
Response::json($arr1,$arr2);
}
?>
