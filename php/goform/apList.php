<?php
// 引用response.php
require_once ('./response.php');
$state=array(
    "code"=>2000,
    "msg"=>"OK"
);
$data=array(
    "pages" => array(
            "start"=> 2,
            "size"=> 2,
            "currPage"=> 2,
            "totalPage"=> 4,
            "total"=>4,
            "nextPage"=>3,
            "lastPage"=> 4
    ),
    "list" => array(
                "devicetype"=>"point2point",
                "devicename"=> "神器",
                "ip"=> "192.168.5.53",
                "mac"=>"12:33:44:55:66:78",
                "status"=>"online",
                "model"=>"V2.2",
                "softversion"=>"V1.1",
                "channel"=>"auto",
                "operationhours"=> 3600,
                "downstream"=> "256",
                "upstream"=> "1232323",
                "connectedNumbers"=> 2323,
                "newest"=> "1"
    )
  );
Responsestatedata::json($state,$data);
?>
