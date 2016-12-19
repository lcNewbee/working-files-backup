<?php

    function json_ok($msg = 'ok') {
        $arr = array('state' => array('code' => 2000, 'msg' => $msg));
        return $arr;
    }
    function json_no($msg = 'error') {
        $arr = array('state' => array('code' => 4000, 'msg' => $msg));
        return $arr;
    }
    /**
     *  判断某列值是否存在
     *  @db 数据库对象
     *  @colums 列
     *  @tablename 表名
     *  @wheres 条件带where
    */
    function is_columns($db, $colums, $tablename, $wheres=' where 1=1') {
        $result = 0;
        $sqlcmd = "select " . $colums . " from " . $tablename . " " . $wheres;
        $queryda = $db->query($sqlcmd);
        $datarow = $queryda->row();
        if (is_object($datarow)) {
            $result = 1;
        }
        return $result;
    }
    /**
    * 日志记录
    * @db 数据库对象
    * @data 熟悉
    *  $data = array(
    *       'log_type'=>'add',
    *       'operation_name'=>'admin',
    *       'operation_obj'=>'ssid',
    *       'description'=>'add ssid'
    *  );
    */
    function Log_Record($db,$data) {
        $result = FALSE;
        $result = $db->insert('web_log', $data);
        if ($result) {
            $result = TRUE;
        } 
        return $result;
    }

