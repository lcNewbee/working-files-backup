<?php
var $db_host = 'localhost';
var $db_username= 'root';
var $db_password= '123';
var $db_database= 'user';

$db =mysql_connect($ db_host,$db_username,$-> db_password,$-> db_database);
if (mysqli_connect_errno()) {
echo "连接数据库失败!";
exit;
}
return $db;
}

}
?>
