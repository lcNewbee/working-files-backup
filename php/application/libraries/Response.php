<?php

 class Responsestatedata{
    public static function json($state= array(), $data = array()){

        // 把两个参数组装成新的数组数据然后输出
        $result=array(
            'state'=>$state,
            'data'=>$data
        );
        echo json_encode($result);
        exit;
    }
 }

?>
